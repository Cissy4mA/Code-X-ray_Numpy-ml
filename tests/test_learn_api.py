import importlib
import os
import shutil
import tempfile
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend import db, learn


class LearnApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        database = os.path.join(cls.temp_dir.name, "learn.sqlite3")
        shutil.copy2(db.SQLITE_PATH, database)
        cls.database_patch = patch.object(db, "SQLITE_PATH", database)
        cls.database_patch.start()
        cls.backend_patch = patch.object(db, "BACKEND", "sqlite")
        cls.backend_patch.start()
        with patch.object(db, "init_db"), patch.dict(os.environ, {"ENABLE_ADMIN_API": "0"}):
            cls.app_module = importlib.import_module("backend.app")
        cls.admin_patch = patch.object(cls.app_module, "ADMIN_API_ENABLED", False)
        cls.admin_patch.start()
        cls.client = TestClient(cls.app_module.app)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        cls.admin_patch.stop()
        cls.backend_patch.stop()
        cls.database_patch.stop()
        cls.temp_dir.cleanup()

    def test_algorithm_details_are_scoped_and_source_backed(self):
        response = self.client.get("/api/learn/algorithm", params={"module": "trees", "algorithm": "RandomForest"})
        self.assertEqual(response.status_code, 200)
        algorithm = response.json()["algorithm"]
        self.assertEqual(algorithm["entity"], "RandomForest")
        self.assertEqual(algorithm["module"], "trees")
        self.assertTrue(algorithm["functions"])
        self.assertTrue(algorithm["code"])
        self.assertGreater(algorithm["source_signals"]["lines"], 0)
        for values in ({"module": "hmm", "algorithm": "RandomForest"},
                       {"module": "trees", "algorithm": "RandomForest", "path": "missing.py"}):
            self.assertIsNone(self.client.get("/api/learn/algorithm", params=values).json()["algorithm"])

    def test_missing_name_is_rejected(self):
        self.assertEqual(self.client.get("/api/learn/algorithm").status_code, 400)

    def test_path_tracks_selected_algorithm(self):
        for name in ("RandomForest", "DecisionTree"):
            response = self.client.get("/api/learn/path", params={"module": "trees", "algorithm": name})
            self.assertEqual(response.status_code, 200)
            result = response.json()
            self.assertEqual(result["algorithm"], name)
            self.assertEqual(len(result["steps"]), 4)
            self.assertEqual(len({step["kind"] for step in result["steps"]}), 4)
            self.assertIn(name, result["steps"][-1]["title"])
            self.assertEqual([item["name"] for item in result["roadmap"]],
                             sorted(item["name"] for item in result["roadmap"]))
            self.assertEqual(sum(item["is_target"] for item in result["roadmap"]), 1)
            self.assertIn("not a verified dependency proof", result["note"])
        missing = self.client.get("/api/learn/path", params={"module": "trees", "algorithm": "Missing"}).json()
        self.assertEqual(missing["steps"], [])

    def test_comparison_contains_real_peers_without_source_payload(self):
        response = self.client.get("/api/learn/compare", params={"module": "trees"})
        self.assertEqual(response.status_code, 200)
        algorithms = response.json()["algorithms"]
        self.assertGreater(len(algorithms), 1)
        self.assertTrue(all(item["module"] == "trees" for item in algorithms))
        self.assertTrue(all("code" not in item for item in algorithms))
        self.assertIn("RandomForest", [item["entity"] for item in algorithms])

    def test_math_cards_do_not_substitute_template_content(self):
        result = self.client.get("/api/learn/card", params={"module": "trees", "algorithm": "RandomForest"}).json()
        self.assertEqual(result["cards"], [])

    def test_source_signals_use_ast_not_comment_keywords(self):
        code = 'def sample(values):\n    """for while if"""\n    return [value for value in values if value]\n'
        signals = learn._source_signals(code)
        self.assertEqual(signals["for_loops"], 0)
        self.assertEqual(signals["while_loops"], 0)
        self.assertEqual(signals["comprehensions"], 1)
        self.assertIsNone(learn._source_signals("def broken("))

    def test_constructor_signature_is_not_replaced_by_training_parameters(self):
        code = 'class Example:\n    def fit(self, samples, targets):\n        pass\n'
        self.assertEqual(learn._signature_params(code), [])
        code = 'class Example:\n    def __init__(\n        self, depth: int = 3, *, seed=None\n    ):\n        pass\n'
        self.assertEqual(learn._signature_params(code), ["depth", "seed"])

    def test_graph_does_not_fall_back_to_unrelated_entity(self):
        result = self.client.get("/api/learn/call_graph", params={"module": "trees", "entity": "Missing"}).json()
        self.assertEqual(result["nodes"], [])
        self.assertEqual(result["edges"], [])

    def test_graph_only_returns_edges_between_indexed_nodes(self):
        result = self.client.get("/api/learn/call_graph", params={"module": "trees", "entity": "RandomForest"}).json()
        self.assertTrue(result["nodes"])
        identifiers = {node["id"] for node in result["nodes"]}
        for edge in result["edges"]:
            self.assertIn(edge["source"], identifiers)
            self.assertIn(edge["target"], identifiers)

    def test_admin_protection_is_preserved(self):
        self.assertEqual(self.client.get("/api/eval").status_code, 403)


if __name__ == "__main__":
    unittest.main()
