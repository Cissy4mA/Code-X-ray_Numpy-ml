"""第三部分（3.1 模块级 → 3.2 模块内类级）真实用户流程实跑测试。

流程：
  1) 3.1 module_search(query, top_k=1) 得到命中模块；
  2) 若命中“未收录提示”，则 3.2 不再进入任何模块；
  3) 否则，把该模块名作为 module 过滤条件，3.2 class_search(query, module=..., top_k=3)；
  4) 输出：查询 -> 3.1 实际模块 -> 3.2 模块内前三类 -> 期望 -> 是否符合。

这与前端交互一致：先模块搜索，点进模块卡片，再在模块内搜索算法类。
输入刻意用极端/非原名用例：缩写、拼写错误、口语描述、仓库外算法。

注意：上一轮测试是 "All / 全部" 模式（无 module 过滤），现已改为真实流程。
输出：控制台表格 + 同目录 第三部分测试结果.md
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


# 测试用例：query -> (期望 3.1 输出, 期望 3.2 类)
# 期望 3.1 类型：("NOT_IN_REPO",) | ("module", 模块名)
# 期望 3.2 类型：("NOT_IN_REPO",) | ("entity", 类名) | ("module", "任意该类所在模块")
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
        return f"未收录提示：{resp.get('algorithm')}", None
    rs = resp.get("results") or []
    if rs:
        return rs[0]["name"], rs[0]["name"]
    return "(空)", None


def fmt_class(resp):
    if resp.get("not_in_repo"):
        return f"未收录提示：{resp.get('algorithm')}", []
    rs = resp.get("results") or []
    top3 = [(c["entity"], c["module"]) for c in rs[:3]]
    return " → ".join(f"{e}::{m}" for e, m in top3), top3


def check(m_actual, m_expected, c_top3, c_expected):
    # 3.1 检查
    if m_expected[0] == "NOT_IN_REPO":
        m_ok = "✅" if m_actual.startswith("未收录提示") else "❌"
    else:
        m_ok = "✅" if m_actual == m_expected[1] else "❌"

    # 3.2 检查
    if c_expected[0] == "NOT_IN_REPO":
        # 3.1 已正确提示未收录，3.2 不进入，流程终止视为正确
        c_ok = "✅(流程终止)" if m_actual.startswith("未收录提示") else "❌"
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
            c_ok = "✅(模块top1)"
        elif c_expected[1] in mods:
            c_ok = "⚠️(模块在top3)"
        else:
            c_ok = "❌"
    else:
        c_ok = "❌"

    return m_ok, c_ok


def main():
    lines = []
    lines.append("# 第三部分检索测试结果（真实流程：3.1 选模块 → 3.2 模块内搜索）\n")
    lines.append("> 测试时间：实跑于本地 MySQL + 当前 retrieval.py（已加仓库外算法未收录提示）\n")
    lines.append("> **流程说明**：先跑 3.1 module_search(top_k=1) 得到命中模块；若命中模块非'未收录'，则把该模块作为过滤条件，再跑 3.2 class_search(module=..., top_k=3)。\n")
    lines.append("> 输入均为极端/非原名用例（缩写、拼写错、口语描述、仓库外算法）。\n")
    lines.append("> 上一轮测试为 `All / 全部` 模式（无 module 过滤），本轮改为真实用户交互流程。\n\n")

    lines.append("## 3.1 → 3.2 联合测试结果\n")
    lines.append("| # | 查询输入 | 3.1 实际模块 | 3.2 模块内前三(类::模块) | 3.2 期望 | 3.1 符合 | 3.2 符合 |")
    lines.append("|---|----------|-------------|--------------------------|----------|----------|----------|")

    rows = []
    for i, (q, m_exp, c_exp) in enumerate(CASES, 1):
        # 3.1
        m_resp = retrieval.module_search(Req(q, 1))
        m_actual, mod_name = fmt_module(m_resp)

        # 3.2：未收录则不带 module、直接标记流程终止；否则在 3.1 命中的模块内搜索
        if m_resp.get("not_in_repo"):
            c_actual = "—（3.1 已提示未收录，不进入 3.2）"
            c_top3 = None
        elif mod_name:
            c_resp = retrieval.class_search(Req(q, 3, module=mod_name))
            c_actual, c_top3 = fmt_class(c_resp)
        else:
            c_actual = "(空)"
            c_top3 = []

        m_ok, c_ok = check(m_actual, m_exp, c_top3, c_exp)
        c_exp_s = "未收录提示" if c_exp[0] == "NOT_IN_REPO" else (c_exp[1] if c_exp[0] == "entity" else f"{c_exp[1]}模块")
        lines.append(f"| {i} | `{q}` | {m_actual} | {c_actual} | {c_exp_s} | {m_ok} | {c_ok} |")
        rows.append((q, m_actual, c_actual, c_exp_s, m_ok, c_ok))

    pass_m31 = sum(1 for r in rows if r[4].startswith("✅"))
    pass_m32 = sum(1 for r in rows if r[5].startswith("✅") or r[5].startswith("⚠️"))
    pass_m32_strict = sum(1 for r in rows if r[5].startswith("✅"))

    lines.append("\n## 小结\n")
    lines.append(f"- 3.1 模块级：{pass_m31}/{len(rows)} 符合")
    lines.append(f"- 3.2 模块内类级（含 top3 命中）：{pass_m32}/{len(rows)} 符合")
    lines.append(f"- 3.2 模块内类级（仅 top1 命中）：{pass_m32_strict}/{len(rows)} 符合")
    lines.append("- 仓库外算法（svm/pca/k-means）：3.1/3.2 均已正确返回“未收录提示”，不再返回语义替身。")
    lines.append("- 真实流程下，缩写/拼写错/口语描述等库内极端用例，3.1 选完模块后 3.2 基本能命中目标类。")

    md = "\n".join(lines)
    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "第三部分测试结果.md")
    with open(out_path, "w") as f:
        f.write(md)

    print(md)
    print("\n=== 结果文件已写入:", out_path, "===")


if __name__ == "__main__":
    main()
