"""3.2 分类检索 keyword/semantic 融合权重网格搜索。

用法（在项目根目录、激活虚拟环境后）：
    python scripts/sweep_class_weight.py
"""
import sys
import os

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from backend import eval_test


def main():
    weights = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    print("kw_weight | semantic | MRR   | Hit@1 | Hit@3 | Hit@5")
    print("-" * 55)
    best_mrr = -1.0
    best = None
    rows = []
    for w in weights:
        res = eval_test.evaluate_class_search(kw_weight=w, top_k=5)
        sw = round(1.0 - w, 2)
        row = {
            "kw_weight": w,
            "sem_weight": sw,
            "MRR": res["MRR"],
            "Hit@1": res["Hit@1"],
            "Hit@3": res["Hit@3"],
            "Hit@5": res["Hit@5"],
        }
        rows.append(row)
        print(
            f"{w:<9} | {sw:<8} | {res['MRR']:<5} | {res['Hit@1']:<5} | "
            f"{res['Hit@3']:<5} | {res['Hit@5']:<5}"
        )
        if res["MRR"] > best_mrr:
            best_mrr = res["MRR"]
            best = (w, sw, res)

    print("-" * 55)
    w, sw, res = best
    print(f"BEST by MRR: kw_weight={w}, semantic={sw}")
    print(f"  MRR={res['MRR']}, Hit@1={res['Hit@1']}, Hit@3={res['Hit@3']}, Hit@5={res['Hit@5']}")


if __name__ == "__main__":
    main()
