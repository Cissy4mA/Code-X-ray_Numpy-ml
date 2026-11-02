import json
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch

from backend import db, parser
from backend.embedding_index import EmbeddingIndexError, embed_query, ensure_compatible, read_metadata
from scripts.reembed_all import rebuild


class EmbeddingIndexTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.database = str(Path(self.temp.name) / "index.sqlite3")
        self.environment = patch.dict(os.environ, {"EMBEDDING_BACKEND": "local",
            "EMBEDDING_LOCAL_MODEL": parser.DEFAULT_MODEL,
            "EMBEDDING_LOCAL_REVISION": parser.DEFAULT_REVISION})
        self.environment.start()
        self.addCleanup(self.environment.stop)
        self.database_patch = patch.object(db, "SQLITE_PATH", self.database)
        self.database_patch.start()
        self.addCleanup(self.database_patch.stop)
        self.backend_patch = patch.object(db, "BACKEND", "sqlite")
        self.backend_patch.start()
        self.addCleanup(self.backend_patch.stop)
        with sqlite3.connect(self.database) as conn:
            conn.executescript("""
                CREATE TABLE modules(id INTEGER PRIMARY KEY, name TEXT, family TEXT,
                    aliases TEXT, readme TEXT, readme_embedding TEXT);
                CREATE TABLE algorithms(id INTEGER PRIMARY KEY, embedding_text TEXT, embedding_json TEXT);
                CREATE TABLE functions(id INTEGER PRIMARY KEY, embedding_text TEXT, embedding_json TEXT);
                INSERT INTO modules VALUES(1,'trees','Tree-based Models','["random forest"]','Tree models','[0,1]');
                INSERT INTO algorithms VALUES(1,'RandomForest bootstrap ensemble','[0,1]');
                INSERT INTO functions VALUES(1,'RandomForest.fit','[0,1]');
            """)

    def vectors(self):
        with sqlite3.connect(self.database) as conn:
            return [conn.execute(f"SELECT {column} FROM {table}").fetchone()[0]
                    for table, column in (("modules", "readme_embedding"),
                                          ("algorithms", "embedding_json"), ("functions", "embedding_json"))]

    def test_rebuild_updates_every_table_and_preserves_backup(self):
        original = self.vectors()
        with patch.object(parser, "embed_many", side_effect=lambda texts, **kwargs: [[3, 4] for text in texts]) as encode:
            metadata, backup = rebuild(self.database, batch_size=2)
        self.assertEqual(metadata["counts"], {"modules": 1, "algorithms": 1, "functions": 1})
        self.assertEqual(metadata["dimension"], 2)
        self.assertEqual([json.loads(value) for value in self.vectors()], [[0.6, 0.8]] * 3)
        with sqlite3.connect(backup) as conn:
            self.assertEqual(conn.execute("SELECT embedding_json FROM algorithms").fetchone()[0], original[1])
        self.assertIn("random forest", encode.call_args_list[0].args[0][0])
        ensure_compatible()
        with patch.dict(os.environ, {"EMBEDDING_LOCAL_REVISION": "different-version"}):
            with self.assertRaises(EmbeddingIndexError):
                ensure_compatible()

    def test_failure_rolls_back_all_vectors_and_metadata(self):
        original = self.vectors()
        with patch.object(parser, "embed_many", side_effect=[[[1, 0]], RuntimeError("model failed")]):
            with self.assertRaisesRegex(RuntimeError, "model failed"):
                rebuild(self.database, batch_size=1)
        self.assertEqual(self.vectors(), original)
        with sqlite3.connect(self.database) as conn:
            self.assertIsNone(read_metadata(conn))

    def test_inconsistent_dimensions_roll_back(self):
        original = self.vectors()
        with patch.object(parser, "embed_many", return_value=[[1, 0], [1, 0, 0], [1, 0]]):
            with self.assertRaisesRegex(ValueError, "dimensions"):
                rebuild(self.database)
        self.assertEqual(self.vectors(), original)

    def test_unregistered_existing_index_is_rejected(self):
        with self.assertRaises(EmbeddingIndexError):
            ensure_compatible()

    def test_hash_migration_is_rejected_without_writes(self):
        with patch.dict(os.environ, {"EMBEDDING_BACKEND": "hash"}):
            with self.assertRaisesRegex(ValueError, "not hash"):
                rebuild(self.database)
        self.assertFalse((Path(self.temp.name) / "backups").exists())

    def test_vector_validation(self):
        self.assertEqual(parser.normalize_vector([3, 4]), [0.6, 0.8])
        for value in ([], [0, 0], [float("nan")], [float("inf")]):
            with self.assertRaises(ValueError):
                parser.normalize_vector(value)
        with self.assertRaises(ValueError):
            parser.cosine([1, 0], [1, 0, 0])

    def test_query_dimension_is_checked_before_search(self):
        with patch("backend.embedding_index.ensure_compatible", return_value={"dimension": 384}), \
                patch.object(parser, "embed", return_value=[1, 0]):
            with self.assertRaises(EmbeddingIndexError):
                embed_query("random forest")

    def test_explicit_local_backend_does_not_use_api_key(self):
        with patch.dict(os.environ, {"EMBEDDING_API_KEY": "unused-test-key"}):
            self.assertEqual(parser.embedding_config()["backend"], "local")

    def test_cached_model_loads_once_from_disk_without_hub_lookup(self):
        model = object()
        factory = Mock(return_value=model)
        snapshot = Mock(return_value="/cached/snapshot")
        modules = {"sentence_transformers": SimpleNamespace(SentenceTransformer=factory),
                   "huggingface_hub": SimpleNamespace(snapshot_download=snapshot)}
        with patch.dict(sys.modules, modules), patch.object(parser, "_MODEL", None), \
                patch.object(parser, "_MODEL_CONFIG", None):
            with ThreadPoolExecutor(max_workers=4) as executor:
                models = list(executor.map(lambda unused: parser._get_model(), range(4)))
        self.assertTrue(all(result is model for result in models))
        factory.assert_called_once_with("/cached/snapshot", local_files_only=True)
        snapshot.assert_called_once_with(parser.DEFAULT_MODEL, local_files_only=True,
                                         revision=parser.DEFAULT_REVISION)

    def test_missing_cache_uses_pinned_model_download(self):
        factory = Mock()
        modules = {"sentence_transformers": SimpleNamespace(SentenceTransformer=factory),
                   "huggingface_hub": SimpleNamespace(snapshot_download=Mock(side_effect=FileNotFoundError))}
        with patch.dict(sys.modules, modules), patch.object(parser, "_MODEL", None), \
                patch.object(parser, "_MODEL_CONFIG", None):
            parser._get_model()
        factory.assert_called_once_with(parser.DEFAULT_MODEL, revision=parser.DEFAULT_REVISION)

    def test_hash_does_not_depend_on_python_hash_seed(self):
        expected = parser._embed_hash("random forest")
        with patch("builtins.hash", side_effect=AssertionError("unstable hash used")):
            self.assertEqual(parser._embed_hash("random forest"), expected)


if __name__ == "__main__":
    unittest.main()
