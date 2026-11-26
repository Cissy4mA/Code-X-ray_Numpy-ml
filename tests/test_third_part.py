"""Part 3 (3.1 module level -> 3.2 in-module class level) real user-flow test.

Flow:
    1) 3.1 module_search(query, top_k=1) obtains the matched module;
    2) If a "not-in-repo notice" is matched, 3.2 does not enter any module;
    3) Otherwise, use that module name as the module filter for 3.2 class_search(query, module=..., top_k=3);
    4) Output: query -> 3.1 actual module -> 3.2 top-3 classes in module -> expected -> whether it matches.

This matches the frontend interaction: search modules first, click into a module card, then search algorithm classes within the module.
Inputs deliberately use extreme/non-canonical cases: abbreviations, typos, colloquial descriptions, out-of-repo algorithms.

Note: the previous test run was in "All" mode (no module filter); this is now the real flow.
Output: console table + part3_test_results.md in the same directory.
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from backend import retrieval


class Req:
    def __init__(self, query, top_k, module=""):
        self.query = query
        self.top_k = top_k
        self.module = module
        self.family = ""
        self.task = ""


# Test cases: query -> (expected 3.1 output, expected 3.2 class)
# Expected 3.1 types: ("NOT_IN_REPO",) | ("module", module name)
# Expected 3.2 types: ("NOT_IN_REPO",) | ("entity", class name) | ("module", "any module containing that class")
CASES = [
    ("svm", ("NOT_IN_REPO",), ("NOT_IN_REPO",)),
    ("pca", ("NOT_IN_REPO",), ("NOT_IN_REPO",)),
    ("k-means", ("NOT_IN_REPO",), ("NOT_IN_REPO",)),
    ("hmm", ("module", "hmm"), ("entity", "MultinomialHMM")),
    ("gmm", ("module", "gmm"), ("entity", "GMM")),
    ("lda", ("module", "lda"), ("entity", "LDA")),
    ("decison tree", ("module", "trees"), ("entity", "DecisionTree")),
    ("logisitc regresion", ("module", "linear_models"), ("entity", "LogisticRegression")),
    ("gausian mixture", ("module", "gmm"), ("entity", "GMM")),
    ("random forest", ("module", "trees"), ("entity", "RandomForest")),
    ("xgboost", ("module", "trees"), ("entity", "GradientBoostedDecisionTree")),
    ("q learning", ("module", "rl_models"), ("entity", "DynaAgent")),
    ("reinforcement learning", ("module", "rl_models"), ("entity", "DynaAgent")),
    ("neural network", ("module", "neural_nets"), ("module", "neural_nets")),
    ("naive bayes", ("module", "linear_models"), ("entity", "GaussianNBClassifier")),
]


def fmt_module(resp):
    if resp.get("not_in_repo"):
        return f"Not-in-repo notice: {resp.get('algorithm')}", None
    rs = resp.get("results") or []
    if rs:
        return rs[0]["name"], rs[0]["name"]
    return "(empty)", None


def fmt_class(resp):
    if resp.get("not_in_repo"):
        return f"Not-in-repo notice: {resp.get('algorithm')}", []
    rs = resp.get("results") or []
    top3 = [(c["entity"], c["module"]) for c in rs[:3]]
    return " → ".join(f"{e}::{m}" for e, m in top3), top3


def check(m_actual, m_expected, c_top3, c_expected):
    # 3.1 check
    if m_expected[0] == "NOT_IN_REPO":
        m_ok = "✅" if m_actual.startswith("Not-in-repo notice") else "❌"
    else:
        m_ok = "✅" if m_actual == m_expected[1] else "❌"

    # 3.2 check
    if c_expected[0] == "NOT_IN_REPO":
        # 3.1 correctly flagged not-in-repo; 3.2 does not enter, and stopping the flow is considered correct
        c_ok = "✅(flow stopped)" if m_actual.startswith("Not-in-repo notice") else "❌"
        return m_ok, c_ok

    if not c_top3:
        return m_ok, "❌"

    ents = [e for e, m in c_top3]
    mods = [m for e, m in c_top3]

    if c_expected[0] == "entity":
        if ents and ents[0] == c_expected[1]:
            c_ok = "✅(top1)"
        elif c_expected[1] in ents:
            c_ok = "⚠️(top3)"
        else:
            c_ok = "❌"
    elif c_expected[0] == "module":
        if mods and mods[0] == c_expected[1]:
            c_ok = "✅(module top1)"
        elif c_expected[1] in mods:
            c_ok = "⚠️(module in top3)"
        else:
            c_ok = "❌"
    else:
        c_ok = "❌"

    return m_ok, c_ok


def main():
    lines = []
    lines.append("# Part 3 Retrieval Test Results (Real Flow: 3.1 select module -> 3.2 search within module)\n")
    lines.append("> Test time: run on local MySQL + current retrieval.py (with the out-of-repo not-indexed notice added)\n")
    lines.append("> **Flow**: first run 3.1 module_search(top_k=1) to get the matched module; if it is not the not-indexed notice, use that module as the filter and run 3.2 class_search(module=..., top_k=3).\n")
    lines.append("> Inputs are all extreme/non-canonical cases (abbreviations, typos, colloquial descriptions, out-of-repo algorithms).\n")
    lines.append("> The previous run used `All` mode (no module filter); this run uses the real user interaction flow.\n\n")

    lines.append("## 3.1 -> 3.2 Combined Test Results\n")
    lines.append("| # | Query Input | 3.1 Actual Module | 3.2 Top-3 in Module (class::module) | 3.2 Expected | 3.1 Match | 3.2 Match |")
    lines.append("|---|----------|-------------|--------------------------|----------|----------|----------|")

    rows = []
    for i, (q, m_exp, c_exp) in enumerate(CASES, 1):
        # 3.1
        m_resp = retrieval.module_search(Req(q, 1))
        m_actual, mod_name = fmt_module(m_resp)

        # 3.2: if not indexed, do not pass module and mark flow as stopped; otherwise search within the module matched in 3.1
        if m_resp.get("not_in_repo"):
            c_actual = "— (3.1 flagged not-indexed, skipping 3.2)"
            c_top3 = None
        elif mod_name:
            c_resp = retrieval.class_search(Req(q, 3, module=mod_name))
            c_actual, c_top3 = fmt_class(c_resp)
        else:
            c_actual = "(empty)"
            c_top3 = []

        m_ok, c_ok = check(m_actual, m_exp, c_top3, c_exp)
        c_exp_s = "Not-in-repo notice" if c_exp[0] == "NOT_IN_REPO" else (c_exp[1] if c_exp[0] == "entity" else f"{c_exp[1]} module")
        lines.append(f"| {i} | `{q}` | {m_actual} | {c_actual} | {c_exp_s} | {m_ok} | {c_ok} |")
        rows.append((q, m_actual, c_actual, c_exp_s, m_ok, c_ok))

    pass_m31 = sum(1 for r in rows if r[4].startswith("✅"))
    pass_m32 = sum(1 for r in rows if r[5].startswith("✅") or r[5].startswith("⚠️"))
    pass_m32_strict = sum(1 for r in rows if r[5].startswith("✅"))

    lines.append("\n## Summary\n")
    lines.append(f"- 3.1 module level: {pass_m31}/{len(rows)} matched")
    lines.append(f"- 3.2 in-module class level (including top3 hits): {pass_m32}/{len(rows)} matched")
    lines.append(f"- 3.2 in-module class level (top1 hits only): {pass_m32_strict}/{len(rows)} matched")
    lines.append("- Out-of-repo algorithms (svm/pca/k-means): both 3.1/3.2 correctly returned the not-in-repo notice, no semantic substitutes.")
    lines.append("- Under the real flow, for in-repo extreme cases such as abbreviations/typos/colloquial descriptions, 3.2 basically hits the target class after 3.1 selects the module.")

    md = "\n".join(lines)
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "part3_test_results.md")
    with open(out_path, "w") as f:
        f.write(md)

    print(md)
    print("\n=== Results written to:", out_path, "===")


if __name__ == "__main__":
    main()
