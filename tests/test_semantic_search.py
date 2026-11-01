import importlib
import os
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

from backend import db


@unittest.skipUnless(os.environ.get("RUN_SEMANTIC_TESTS") == "1",
                     "Set RUN_SEMANTIC_TESTS=1 with a cached model and rebuilt semantic index")
class SemanticSearchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        from fastapi.testclient import TestClient

        cls.temp = tempfile.TemporaryDirectory()
        cls.addClassCleanup(cls.temp.cleanup)
        database = str(Path(cls.temp.name) / "semantic.sqlite3")
        shutil.copy2(db.SQLITE_PATH, database)
        for config_patch in (patch.object(db, "SQLITE_PATH", database),
                             patch.object(db, "BACKEND", "sqlite")):
            config_patch.start()
            cls.addClassCleanup(config_patch.stop)
        with patch.object(db, "init_db"):
            app = importlib.import_module("backend.app").app
        cls.client = TestClient(app)
        cls.addClassCleanup(cls.client.close)

    def test_named_queries_follow_both_stages(self):
        for query, module, algorithm in (
            ("random forest", "trees", "RandomForest"),
            ("linear regression", "linear_models", "LinearRegression"),
            ("logistic regression", "linear_models", "LogisticRegression"),
            ("hidden markov model", "hmm", "MultinomialHMM"),
            ("gaussian mixture model", "gmm", "GMM"),
            ("model observations with hidden states", "hmm", "MultinomialHMM"),
        ):
            with self.subTest(query=query):
                response = self.client.post("/api/modules/search", json={"query": query})
                self.assertEqual(response.status_code, 200, response.text)
                self.assertEqual(response.json()["results"][0]["name"], module)
                response = self.client.post("/api/search", json={"query": query, "module": module})
                self.assertEqual(response.status_code, 200, response.text)
                result = response.json()["results"][0]
                self.assertEqual(result["entity"], algorithm)
                self.assertGreater(result["semantic"], 0)
                self.assertGreater(result["fused"], 0)
                self.assertTrue(result["code"])

    def test_model_mismatch_returns_actionable_503(self):
        with patch.dict(os.environ, {"EMBEDDING_BACKEND": "hash"}):
            for endpoint in ("/api/modules/search", "/api/search"):
                response = self.client.post(endpoint, json={"query": "random forest"})
                self.assertEqual(response.status_code, 503)
                self.assertIn("reembed_all.py", response.json()["detail"])

    def test_unsupported_algorithm_stays_explicit(self):
        response = self.client.post("/api/modules/search", json={"query": "svm"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["not_in_repo"])
        self.assertEqual(response.json()["results"], [])


if __name__ == "__main__":
    unittest.main()
