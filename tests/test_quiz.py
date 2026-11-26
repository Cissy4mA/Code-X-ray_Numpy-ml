import unittest

from backend.quiz import generate_quiz


class QuizTests(unittest.TestCase):
    def test_same_name_different_source_changes_questions_and_answers(self):
        first = generate_quiz({"entity": "Model", "code": "def predict(self, X):\n    return X @ self.weights"})
        second = generate_quiz({"entity": "Model", "code": "def fit(self, data, epochs=8):\n    for epoch in range(epochs):\n        if self.ready:\n            return data.mean()"})
        self.assertNotEqual(first, second)
        self.assertNotEqual(len(first), len(second))
        self.assertTrue(any(item["answer"] == "data.mean()" for item in second))
        self.assertFalse(any("weights" in item["answer"] for item in second))
        self.assertTrue(any("epochs=8" in item["answer"] for item in second))

    def test_ast_ignores_comments_docstring_code_and_multiline_expressions_work(self):
        questions = generate_quiz({"entity": "Model", "path": "model.py", "lines": "40-80", "code": '''def predict(
    self,
    X,
    scale=2,
):
    """for ghost in nonexistent:
        return phantom
    """
    # return imaginary
    return (
        X @ self.weights
    )
'''})
        returns = [item for item in questions if item["kind"] == "return"]
        self.assertEqual(len(returns), 1)
        self.assertEqual(returns[0]["answer"], "X @ self.weights")
        self.assertFalse(any(item["kind"] == "loop" for item in questions))
        self.assertTrue(any("scale=2" in item["answer"] for item in questions))
        self.assertTrue(returns[0]["evidence"].startswith("model.py:49-51"))

    def test_real_structure_creates_variable_question_bank(self):
        questions = generate_quiz({"entity": "Optimizer", "code": '''def update(self, X, lr=0.1):
    result = [item * lr for item in X if item > 0]
    while self.ready:
        self.weights -= lr * result
        if self.done:
            return sum(result)
    return result
'''})
        kinds = {item["kind"] for item in questions}
        self.assertTrue({"signature", "state", "comprehension", "loop", "branch", "return", "call"} <= kinds)
        self.assertGreater(len(questions), 5)
        self.assertTrue(any("item > 0" in item["answer"] for item in questions))

    def test_metadata_changes_and_no_fabricated_five_question_fallback(self):
        first = generate_quiz({"entity": "Meta", "params": ["lr"], "math_methods": ["Gradient descent"]})
        second = generate_quiz({"entity": "Meta", "params": ["neighbors"], "math_methods": ["Euclidean distance"]})
        self.assertEqual(len(first), 2)
        self.assertNotEqual(first, second)
        self.assertEqual(generate_quiz({"entity": "Empty"}), [])
        self.assertEqual(generate_quiz({"entity": "Broken", "code": "def broken(", "params": ["depth"]})[0]["kind"], "parameter")

    def test_long_source_does_not_crowd_out_distinct_structures(self):
        code = "\n".join(f"def method_{index}(self):\n    return {index}" for index in range(20))
        code += "\nfor batch in batches:\n    if ready:\n        consume(batch)"
        questions = generate_quiz({"entity": "Large", "code": code})
        self.assertEqual(len(questions), 12)
        self.assertTrue({"loop", "branch", "call"} <= {item["kind"] for item in questions})


if __name__ == "__main__":
    unittest.main()
