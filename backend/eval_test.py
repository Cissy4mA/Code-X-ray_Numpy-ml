"""检索评估与测试保障。

这是检索评估与测试（分工 3）的负责范围。
- EVAL_QUERIES：评测查询集（按真实需求扩充，标注期望命中的模块/算法）
- evaluate()：算 MRR 与 Hit@k，给检索精度（retrieval.py）量化背书
- smoke_test()：接口/数据连通性冒烟，保证演示时后端不挂
"""
from types import SimpleNamespace

from backend import db, retrieval, parser

# 评测查询集：每个样本标注期望命中的 module / algorithm（可留空表示只验是否召回相关）
# 注：evaluate() 走的是 retrieval.rank()（debug/旧融合池），保留历史指标可比性。
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

# 3.2 分类级评测：基于 class_search 的真实线上路径，期望值与当前 numpy-ml 实际类名对齐。
CLASS_EVAL_QUERIES = [
    {"query": "logistic regression", "module": "linear_models", "algorithm": "LogisticRegression"},
    {"query": "decision tree classifier", "module": "trees", "algorithm": "DecisionTree"},
    {"query": "k-means clustering", "module": "kmeans", "algorithm": "KMeans"},
    {"query": "gaussian mixture model", "module": "gmm", "algorithm": "GMM"},
    {"query": "hidden markov model forward backward", "module": "hmm", "algorithm": "MultinomialHMM"},
    {"query": "neural network backpropagation", "module": "neural_nets", "algorithm": None},
    {"query": "reinforcement learning q learning", "module": "rl_models", "algorithm": None},
]

# 模块级评测：近义 / 自然语言表达，验证语义检索（RRF）带来的召回增量（分工 1 · 方案 3）。
# 注意：仅覆盖 numpy-ml 当前 master 真实存在的 13 个模块
# （naive_bayes / ar_models 等已从上游仓库移除，不再作为期望模块）。
MODULE_EVAL_QUERIES = [
    {"query": "topic modeling over documents", "module": "lda"},
    {"query": "mixture of gaussians for clustering", "module": "gmm"},
    {"query": "deep learning neural network", "module": "neural_nets"},
    {"query": "learn to play games by reward", "module": "rl_models"},
    {"query": "sequential data with hidden states", "module": "hmm"},
    {"query": "recommendation with matrix factorization", "module": "factorization"},
    {"query": "classification with trees", "module": "trees"},
    {"query": "multi-armed bandit", "module": "bandits"},
    {"query": "linear regression", "module": "linear_models"},
    {"query": "n-gram language model", "module": "ngram"},
    {"query": "kernel density estimation", "module": "nonparametric"},
    {"query": "normalize and scale features", "module": "preprocessing"},
    {"query": "helper functions and utilities", "module": "utils"},
    {"query": "cluster text into topics", "module": "lda"},
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


def evaluate_class_search(kw_weight=0.5, top_k=5, queries=None):
    """3.2 分类级检索评测：测试 keyword/semantic 融合权重对 MRR/Hit@k 的影响。

    只返回期望 algorithm 或 module 是否出现在 class_search 的 top_k 结果里，
    不考核游离函数。
    """
    if queries is None:
        queries = CLASS_EVAL_QUERIES
    per_query = []
    rr_sum = 0.0
    h1 = h3 = h5 = 0
    for q in queries:
        req = SimpleNamespace(
            query=q["query"], top_k=top_k, module="", family="", task="",
            kw_weight=kw_weight,
        )
        res = retrieval._class_search_weighted(req, kw_weight=kw_weight)
        results = res["results"]
        rr = _reciprocal_rank(results, q)
        rr_sum += rr
        h1 += int(_hit_at(results, q, 1))
        h3 += int(_hit_at(results, q, 3))
        h5 += int(_hit_at(results, q, 5))
        per_query.append({
            "query": q["query"],
            "expected_module": q.get("module"),
            "expected_algorithm": q.get("algorithm"),
            "mrr": round(rr, 4),
            "hit@1": _hit_at(results, q, 1),
            "hit@3": _hit_at(results, q, 3),
            "hit@5": _hit_at(results, q, 5),
            "top1": results[0]["entity"] if results else None,
        })
    n = len(queries)
    return {
        "kw_weight": kw_weight,
        "top_k": top_k,
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


def evaluate_modules():
    """模块级评测：用近义/自然语言表达验证 RRF 融合检索能否把期望模块排到前列。"""
    per_query = []
    rr_sum = 0.0
    h1 = h3 = h5 = 0
    for q in MODULE_EVAL_QUERIES:
        res = retrieval.module_search(SimpleNamespace(query=q["query"], top_k=13))
        results = res["results"]
        exp = q["module"]
        rr = 0.0
        for i, r in enumerate(results, start=1):
            if r["name"] == exp:
                rr = 1.0 / i
                break
        rr_sum += rr
        if any(r["name"] == exp for r in results[:1]):
            h1 += 1
        if any(r["name"] == exp for r in results[:3]):
            h3 += 1
        if any(r["name"] == exp for r in results[:5]):
            h5 += 1
        per_query.append({
            "query": q["query"],
            "expected_module": exp,
            "mrr": round(rr, 4),
            "hit@1": any(r["name"] == exp for r in results[:1]),
            "hit@3": any(r["name"] == exp for r in results[:3]),
            "hit@5": any(r["name"] == exp for r in results[:5]),
            "top1": results[0]["name"] if results else None,
        })
    n = len(MODULE_EVAL_QUERIES)
    return {
        "n": n,
        "MRR": round(rr_sum / n, 4) if n else 0.0,
        "Hit@1": round(h1 / n, 4) if n else 0.0,
        "Hit@3": round(h3 / n, 4) if n else 0.0,
        "Hit@5": round(h5 / n, 4) if n else 0.0,
        "per_query": per_query,
    }
