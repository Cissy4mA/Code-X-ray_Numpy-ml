"""检索评估与测试保障。

归属：分工3（检索评估与测试保障）拥有。
- EVAL_QUERIES：评测查询集（你们按真实需求扩充，标注期望命中的模块/算法）
- evaluate()：算 MRR 与 Hit@k，给「检索精度提升」（retrieval.py）量化背书
- smoke_test()：接口/数据连通性冒烟，保证演示时后端不挂
"""
from types import SimpleNamespace

from backend import db, retrieval, parser

# 评测查询集：每个样本标注期望命中的 module / algorithm（可留空表示只验是否召回相关）
EVAL_QUERIES = [
    {"query": "logistic regression", "module": "linear_models", "algorithm": "LogisticRegression"},
    {"query": "decision tree classifier", "module": "trees", "algorithm": "DecisionTree"},
    {"query": "k-means clustering", "module": "kmeans", "algorithm": "KMeans"},
    {"query": "gaussian mixture model", "module": "gmm", "algorithm": "GaussianMixture"},
    {"query": "hidden markov model forward backward", "module": "hmm", "algorithm": None},
    {"query": "neural network backpropagation", "module": "neural_nets", "algorithm": None},
    {"query": "reinforcement learning q learning", "module": "rl", "algorithm": None},
    {"query": "naive bayes classifier", "module": "naive_bayes", "algorithm": "NaiveBayes"},
]


def _req(q, top_k=20):
    return SimpleNamespace(query=q["query"], top_k=top_k, module="", family="", task="")


def _hit_at(results, q, k):
    """results 已由融合分降序排列；检查前 k 个里是否出现期望的 module / algorithm。"""
    exp_module = q.get("module")
    exp_alg = q.get("algorithm")
    for r in results[:k]:
        if exp_module and r["module"] != exp_module:
            continue
        if exp_alg and r["entity"] != exp_alg:
            continue
        # 若无 alg 但有 module，则命中 module 即算；若只有 alg，命中 alg 即算
        if exp_module and exp_alg:
            return True
        if exp_module and not exp_alg and r["module"] == exp_module:
            return True
        if exp_alg and not exp_module and r["entity"] == exp_alg:
            return True
    return False


def _reciprocal_rank(results, q):
    exp_module = q.get("module")
    exp_alg = q.get("algorithm")
    for i, r in enumerate(results, start=1):
        if exp_module and r["module"] != exp_module:
            continue
        if exp_alg and r["entity"] != exp_alg:
            continue
        if exp_module and exp_alg:
            return 1.0 / i
        if exp_module and not exp_alg and r["module"] == exp_module:
            return 1.0 / i
        if exp_alg and not exp_module and r["entity"] == exp_alg:
            return 1.0 / i
    return 0.0


def evaluate():
    """跑评测集，返回每条结果与聚合指标（MRR / Hit@1,3,5）。"""
    per_query = []
    rr_sum = 0.0
    h1 = h3 = h5 = 0
    for q in EVAL_QUERIES:
        results, _ = retrieval.rank(_req(q, top_k=20))
        rr = _reciprocal_rank(results, q)
        rr_sum += rr
        hit1 = _hit_at(results, q, 1)
        hit3 = _hit_at(results, q, 3)
        hit5 = _hit_at(results, q, 5)
        h1 += int(hit1); h3 += int(hit3); h5 += int(hit5)
        per_query.append({
            "query": q["query"], "expected_module": q.get("module"),
            "expected_algorithm": q.get("algorithm"),
            "mrr": round(rr, 4), "hit@1": hit1, "hit@3": hit3, "hit@5": hit5,
            "top1": results[0]["entity"] if results else None,
        })
    n = len(EVAL_QUERIES)
    return {
        "n": n,
        "MRR": round(rr_sum / n, 4) if n else 0.0,
        "Hit@1": round(h1 / n, 4) if n else 0.0,
        "Hit@3": round(h3 / n, 4) if n else 0.0,
        "Hit@5": round(h5 / n, 4) if n else 0.0,
        "per_query": per_query,
    }


def smoke_test():
    """连通性冒烟：库能连、表有数。返回计数与状态。"""
    out = {"db_ok": True, "error": None, "counts": {}}
    try:
        conn = db.get_conn()
        cur = conn.cursor()
        non_algo = tuple(parser.NON_ALGO_MODULES)
        for t, col in (("modules", "name"), ("code_files", "path"),
                       ("algorithms", "id"), ("functions", "id")):
            cur.execute(f"SELECT COUNT(*) FROM {t}")
            out["counts"][t] = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM algorithms WHERE module NOT IN %s OR module=''", (non_algo,))
        out["counts"]["algorithms_algo"] = cur.fetchone()[0]
        conn.close()
    except Exception as e:
        out["db_ok"] = False
        out["error"] = str(e)[:300]
    return out
