"""
Code-X-Ray: 检索系统自动化基准评测与消融实验脚本 (Task 2-3)
完全对齐生产环境两阶段级联架构与 test_third_part 真实评测标注：
- 冒烟测试 (Smoke Test)
- 模块级检索定量评测 (Module Search RRF: Hit@1/3/5, MRR, Latency)
- 两阶段级联端到端评测 (Stage 1 粗筛/OOD 拦截 -> Stage 2 模块内细查)
- 消融实验 (Ablation Study): 严格调用生产环境 class_search，对齐线上 0.2/0.8 权重，分母严格对齐
"""

import copy
import json
import time
from types import SimpleNamespace
from typing import List, Dict, Any, Tuple

from backend import db, retrieval, parser


# ---------------------------------------------------------------------------
# 评测基准数据集 (完全复用 test_third_part.py 验证集, N=15)
# ---------------------------------------------------------------------------
# 格式: (query, 3.1 模块期望, 3.2 类期望)
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

# 模块级语义检索独立测试集 (N=14)
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


class Req:
    """对齐真实请求结构与 kw_weight 权重动态注入"""
    def __init__(self, query: str, top_k: int = 5, module: str = "", kw_weight: float = 0.2):
        self.query = query
        self.top_k = top_k
        self.module = module
        self.family = ""
        self.task = ""
        self.kw_weight = kw_weight


def _calc_latency_stats(latencies_ms: List[float]) -> Dict[str, float]:
    """计算延迟分布指标：平均值、P50 (中位数)、P95。"""
    if not latencies_ms:
        return {"mean": 0.0, "p50": 0.0, "p95": 0.0}
    sorted_lat = sorted(latencies_ms)
    n = len(sorted_lat)
    p50_idx = int(0.50 * n)
    p95_idx = min(int(0.95 * n), n - 1)
    return {
        "mean": round(sum(sorted_lat) / n, 2),
        "p50": round(sorted_lat[p50_idx], 2),
        "p95": round(sorted_lat[p95_idx], 2),
    }


def _check_entity_match(c_item: Dict[str, Any], c_exp: Tuple) -> bool:
    """检查单个返回结果是否命中期望类或模块"""
    if c_exp[0] == "entity":
        return c_item.get("entity") == c_exp[1]
    elif c_exp[0] == "module":
        return c_item.get("module") == c_exp[1]
    return False


# ---------------------------------------------------------------------------
# 1. 冒烟测试
# ---------------------------------------------------------------------------
def smoke_test():
    """连通性冒烟测试：库能连、表有数。"""
    out = {"db_ok": True, "error": None, "counts": {}}
    try:
        conn = db.get_conn()
        cur = conn.cursor()
        non_algo = tuple(parser.NON_ALGO_MODULES)
        for t in ("modules", "code_files", "algorithms", "functions"):
            cur.execute(f"SELECT COUNT(*) FROM {t}")
            out["counts"][t] = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM algorithms WHERE module NOT IN %s OR module=''", (non_algo,))
        out["counts"]["algorithms_algo"] = cur.fetchone()[0]
        conn.close()
    except Exception as e:
        out["db_ok"] = False
        out["error"] = str(e)[:300]
    return out


# ---------------------------------------------------------------------------
# 2. 模块级检索评测 (Module Search RRF)
# ---------------------------------------------------------------------------
def evaluate_modules():
    """跑模块级评测集，记录准确率与端到端 RRF 检索耗时。"""
    per_query = []
    rr_sum = 0.0
    h1 = h3 = h5 = 0
    latencies = []

    for q in MODULE_EVAL_QUERIES:
        t0 = time.perf_counter()
        res = retrieval.module_search(Req(q["query"], top_k=13))
        t1 = time.perf_counter()

        elapsed_ms = (t1 - t0) * 1000.0
        latencies.append(elapsed_ms)

        results = res.get("results", []) or []
        exp = q["module"]
        rr = 0.0
        for i, r in enumerate(results, start=1):
            if r.get("name") == exp:
                rr = 1.0 / i
                break
        rr_sum += rr
        if any(r.get("name") == exp for r in results[:1]):
            h1 += 1
        if any(r.get("name") == exp for r in results[:3]):
            h3 += 1
        if any(r.get("name") == exp for r in results[:5]):
            h5 += 1

        per_query.append({
            "query": q["query"],
            "expected_module": exp,
            "mrr": round(rr, 4),
            "hit@1": any(r.get("name") == exp for r in results[:1]),
            "hit@3": any(r.get("name") == exp for r in results[:3]),
            "hit@5": any(r.get("name") == exp for r in results[:5]),
            "latency_ms": round(elapsed_ms, 2),
            "top1": results[0]["name"] if results else None,
        })

    n = len(MODULE_EVAL_QUERIES)
    latency_stats = _calc_latency_stats(latencies)
    return {
        "n": n,
        "MRR": round(rr_sum / n, 4) if n else 0.0,
        "Hit@1": round(h1 / n, 4) if n else 0.0,
        "Hit@3": round(h3 / n, 4) if n else 0.0,
        "Hit@5": round(h5 / n, 4) if n else 0.0,
        "latency_mean_ms": latency_stats["mean"],
        "latency_p50_ms": latency_stats["p50"],
        "latency_p95_ms": latency_stats["p95"],
        "per_query": per_query,
    }


# ---------------------------------------------------------------------------
# 3. 两阶段端到端级联评测 (Two-Stage Pipeline Evaluation)
# ---------------------------------------------------------------------------
def evaluate_two_stage_pipeline():
    """
    两阶段级联评测 (对接第三部分真实交互流):
    Step 1: 调用 module_search 进行模块粗筛或 OOD 库外算法拦截。
    Step 2: 若未收录则安全熔断；若命中模块，则带入 module 过滤条件调用 class_search。
    """
    per_query = []
    latencies = []
    
    stage1_hits = 0       # 3.1 模块命中/正确拦截数
    stage2_top1 = 0       # 3.2 类级 Top1 命中数
    stage2_top3 = 0       # 3.2 类级 Top3 命中数
    rr_sum = 0.0
    
    for q, m_exp, c_exp in CASES:
        t0 = time.perf_counter()
        
        # 3.1: 模块检索
        m_resp = retrieval.module_search(Req(q, top_k=1))
        is_ood = m_resp.get("not_in_repo", False)
        m_results = m_resp.get("results", []) or []
        actual_mod = "NOT_IN_REPO" if is_ood else (m_results[0]["name"] if m_results else None)
        
        # 3.1 验证
        if m_exp[0] == "NOT_IN_REPO":
            s1_ok = is_ood
        else:
            s1_ok = (actual_mod == m_exp[1])
            
        if s1_ok:
            stage1_hits += 1
            
        # 3.2: 模块内类检索
        s2_hit1 = False
        s2_hit3 = False
        rr = 0.0
        top1_entity = None
        
        if is_ood:
            top1_entity = "NOT_IN_REPO (Intercepted)"
            if c_exp[0] == "NOT_IN_REPO":
                s2_hit1 = True
                s2_hit3 = True
                rr = 1.0
        elif actual_mod:
            c_resp = retrieval.class_search(Req(q, top_k=3, module=actual_mod, kw_weight=0.2))
            c_results = c_resp.get("results", []) or []
            
            if c_results:
                top1_entity = f"{c_results[0].get('entity')}::{c_results[0].get('module')}"
                if _check_entity_match(c_results[0], c_exp):
                    s2_hit1 = True
                for rank_idx, item in enumerate(c_results[:3], start=1):
                    if _check_entity_match(item, c_exp):
                        s2_hit3 = True
                        rr = 1.0 / rank_idx
                        break
        else:
            top1_entity = "(None)"

        t1 = time.perf_counter()
        elapsed_ms = (t1 - t0) * 1000.0
        latencies.append(elapsed_ms)
        
        stage2_top1 += int(s2_hit1)
        stage2_top3 += int(s2_hit3)
        rr_sum += rr
        
        c_exp_str = "NOT_IN_REPO" if c_exp[0] == "NOT_IN_REPO" else f"{c_exp[1]} ({c_exp[0]})"
        per_query.append({
            "query": q,
            "expected": f"{m_exp[1] if m_exp[0]=='module' else 'OOD'}::{c_exp_str}",
            "actual_mod": actual_mod,
            "top1_result": top1_entity,
            "stage1_ok": s1_ok,
            "stage2_hit1": s2_hit1,
            "stage2_hit3": s2_hit3,
            "mrr": round(rr, 4),
            "latency_ms": round(elapsed_ms, 2)
        })
        
    n = len(CASES)
    latency_stats = _calc_latency_stats(latencies)
    
    return {
        "n": n,
        "Stage1_Accuracy": round(stage1_hits / n, 4),
        "Stage2_Hit@1": round(stage2_top1 / n, 4),
        "Stage2_Hit@3": round(stage2_top3 / n, 4),
        "MRR": round(rr_sum / n, 4),
        "latency_stats": latency_stats,
        "per_query": per_query
    }


# ---------------------------------------------------------------------------
# 4. 消融实验套件 (Ablation Study)
# ---------------------------------------------------------------------------
def run_ablation_study():
    """
    消融实验套件：
    严格调用真实的 class_search (retrieval.py 308-313 行)，
    权重对齐线上 0.2/0.8 配置，分母严格使用有效样本数 N (剔除 OOD 负例)。
    分别评估【模块内细查】与【全库裸搜】下的 Lexical / Dense / Hybrid 表现。
    """
    print("\n" + "=" * 65)
    print("4. 消融实验评估 (Ablation Study: Lexical vs Dense vs Hybrid)")
    print("=" * 65)

    # 剔除 OOD 负例，得到纯正例集合与准确分母
    eval_cases = [(q, m_exp, c_exp) for q, m_exp, c_exp in CASES if c_exp[0] != "NOT_IN_REPO"]
    n_algo = len(eval_cases)

    # 对齐线上 kw_weight 动态权重机制
    modes = [
        ("Lexical Only (kw=1.0)", 1.0),
        ("Dense Only (kw=0.0)", 0.0),
        ("Hybrid (Online 0.2/0.8)", 0.2),
    ]

    # A. 模块内细查消融 (真实流水线阶段 3.2)
    print(f"\n[模块内类级消融 - Module-Scoped Class Search (N={n_algo})]")
    print(f"{'Retrieval Mode':<28} | {'Hit@1':<8} | {'Hit@3':<8} | {'Hit@5':<8} | {'MRR':<8}")
    print("-" * 68)

    for mode_name, kw_w in modes:
        h1 = h3 = h5 = 0
        rr_sum = 0.0
        for q, m_exp, c_exp in eval_cases:
            mod_scope = m_exp[1] if m_exp[0] == "module" else ""
            req = Req(query=q, top_k=5, module=mod_scope, kw_weight=kw_w)
            results = retrieval.class_search(req).get("results", []) or []

            for rank_idx, item in enumerate(results[:5], start=1):
                if _check_entity_match(item, c_exp):
                    if rank_idx == 1: h1 += 1
                    if rank_idx <= 3: h3 += 1
                    if rank_idx <= 5: h5 += 1
                    rr_sum += 1.0 / rank_idx
                    break

        print(f"{mode_name:<28} | {h1/n_algo*100:>6.2f}% | {h3/n_algo*100:>6.2f}% | {h5/n_algo*100:>6.2f}% | {rr_sum/n_algo:>8.4f}")

    # B. 全库裸搜消融 (无模块过滤，展示跨模块混淆与单阶段瓶颈)
    print(f"\n[算法级全库裸搜消融 - Global Unscoped Class Search (N={n_algo})]")
    print(f"{'Retrieval Mode':<28} | {'Hit@1':<8} | {'Hit@3':<8} | {'Hit@5':<8} | {'MRR':<8}")
    print("-" * 68)

    for mode_name, kw_w in modes:
        h1 = h3 = h5 = 0
        rr_sum = 0.0
        for q, m_exp, c_exp in eval_cases:
            req = Req(query=q, top_k=5, module="", kw_weight=kw_w)  # module 留空模拟全库无约束检索
            results = retrieval.class_search(req).get("results", []) or []

            for rank_idx, item in enumerate(results[:5], start=1):
                if _check_entity_match(item, c_exp):
                    if rank_idx == 1: h1 += 1
                    if rank_idx <= 3: h3 += 1
                    if rank_idx <= 5: h5 += 1
                    rr_sum += 1.0 / rank_idx
                    break

        print(f"{mode_name:<28} | {h1/n_algo*100:>6.2f}% | {h3/n_algo*100:>6.2f}% | {h5/n_algo*100:>6.2f}% | {rr_sum/n_algo:>8.4f}")

    # C. 模块级宏观消融 (README Embedding vs Token vs RRF)
    mod_modes = ["Lexical Only", "Dense Only", "Hybrid (RRF)"]
    mod_metrics = {m: {"hits1": 0, "hits3": 0, "hits5": 0, "rr_sum": 0.0} for m in mod_modes}

    conn = db.get_conn()
    cur = conn.cursor()
    non_algo = tuple(parser.NON_ALGO_MODULES)
    cur.execute(
        "SELECT id, name, family, readme, aliases, readme_embedding "
        "FROM modules WHERE name NOT IN %s ORDER BY name",
        (non_algo,),
    )
    rows = cur.fetchall()

    for q in MODULE_EVAL_QUERIES:
        query_text = (q["query"] or "").strip().lower()
        exp_mod = q["module"]
        
        # 1. 词法
        q_tokens = [t for t in retrieval.re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", query_text)
                    if t not in parser.PY_STOP and t not in retrieval.EN_STOP and len(t) > 1]
        kw_scores = {}
        for r in rows:
            mid, name, family, readme, aliases, _ = r
            na_text = " ".join([name, family or "", aliases or ""]).lower()
            rd_text = (readme or "").lower()
            na_hits = sum(1 for t in q_tokens if t in na_text)
            rd_hits = sum(1 for t in q_tokens if t in rd_text)
            kw_scores[mid] = 2 * na_hits + rd_hits
        kw_ranked_rows = sorted(rows, key=lambda r: kw_scores[r[0]], reverse=True)

        # 2. 语义
        qvec = parser.embed(query_text)
        sem_scores = {}
        for r in rows:
            emb = r[5]
            sem_scores[r[0]] = parser.cosine(qvec, json.loads(emb)) if emb else -1.0
        sem_ranked_rows = sorted(rows, key=lambda r: sem_scores[r[0]], reverse=True)

        # 3. 完整 RRF
        hybrid_res = retrieval.module_search(Req(q["query"], top_k=20)).get("results", []) or []

        for mode in mod_modes:
            if mode == "Lexical Only":
                cands = [r[1] for r in kw_ranked_rows]
            elif mode == "Dense Only":
                cands = [r[1] for r in sem_ranked_rows]
            else:
                cands = [c["name"] for c in hybrid_res]

            rank_idx = None
            for idx, name in enumerate(cands):
                if name.lower() == exp_mod.lower():
                    rank_idx = idx + 1
                    break
            if rank_idx is not None:
                mod_metrics[mode]["rr_sum"] += 1.0 / rank_idx
                if rank_idx <= 1: mod_metrics[mode]["hits1"] += 1
                if rank_idx <= 3: mod_metrics[mode]["hits3"] += 1
                if rank_idx <= 5: mod_metrics[mode]["hits5"] += 1

    conn.close()
    n_mod = len(MODULE_EVAL_QUERIES)
    print(f"\n[模块级宏观检索消融 - Module Level (N={n_mod})]")
    print(f"{'Retrieval Mode':<28} | {'Hit@1':<8} | {'Hit@3':<8} | {'Hit@5':<8} | {'MRR':<8}")
    print("-" * 68)
    for m in mod_modes:
        h1 = (mod_metrics[m]["hits1"] / n_mod) * 100
        h3 = (mod_metrics[m]["hits3"] / n_mod) * 100
        h5 = (mod_metrics[m]["hits5"] / n_mod) * 100
        mrr = mod_metrics[m]["rr_sum"] / n_mod
        print(f"{m:<28} | {h1:>6.2f}% | {h3:>6.2f}% | {h5:>6.2f}% | {mrr:>8.4f}")


# ---------------------------------------------------------------------------
# 报告聚合输出入口
# ---------------------------------------------------------------------------
def print_report():
    print("=" * 65)
    print("1. 数据库连通性冒烟测试 (Smoke Test)")
    print("=" * 65)
    smoke = smoke_test()
    if smoke["db_ok"]:
        print(f"[PASS] 数据库连接正常，数据表统计: {smoke['counts']}")
    else:
        print(f"[FAIL] 数据库连接异常: {smoke['error']}")
        return

    print("\n" + "=" * 65)
    print("2. 模块级混合检索评测 (Module Search RRF)")
    print("=" * 65)
    mod_res = evaluate_modules()
    print(f"评测样本数 (N):   {mod_res['n']}")
    print(f"MRR:             {mod_res['MRR']:.4f}")
    print(f"Hit@1:           {mod_res['Hit@1'] * 100:.2f}%")
    print(f"Hit@3:           {mod_res['Hit@3'] * 100:.2f}%")
    print(f"Hit@5:           {mod_res['Hit@5'] * 100:.2f}%")
    print(f"平均延迟 (Mean):  {mod_res['latency_mean_ms']} ms")
    print(f"中位数延迟 (P50): {mod_res['latency_p50_ms']} ms")
    print(f"高尾延迟 (P95):   {mod_res['latency_p95_ms']} ms")

    print("\n" + "=" * 65)
    print("3. 两阶段端到端级联评测 (Two-Stage Pipeline Evaluation)")
    print("=" * 65)
    algo_res = evaluate_two_stage_pipeline()
    print(f"评测样本数 (N):                {algo_res['n']}")
    print(f"Stage 1 (模块初筛/OOD拦截率):  {algo_res['Stage1_Accuracy'] * 100:.2f}%")
    print(f"Stage 2 (模块内细查 Hit@1):    {algo_res['Stage2_Hit@1'] * 100:.2f}%")
    print(f"Stage 2 (模块内细查 Hit@3):    {algo_res['Stage2_Hit@3'] * 100:.2f}%")
    print(f"MRR:                           {algo_res['MRR']:.4f}")
    lat_stats = algo_res['latency_stats']
    print(f"平均总延迟 (Mean):             {lat_stats['mean']} ms")
    print(f"中位数延迟 (P50):              {lat_stats['p50']} ms")
    print(f"高尾延迟 (P95):                {lat_stats['p95']} ms")

    print("\n[Detail] 端到端各 Query 命中与耗时详情:")
    for pq in algo_res["per_query"]:
        mark = "✓" if pq["stage2_hit1"] else ("o" if pq["stage2_hit3"] else "x")
        print(f"  [{mark}] Query: '{pq['query']}' (期望: {pq['expected']})")
        print(f"      -> 命中模块: {pq['actual_mod']} | 结果: {pq['top1_result']} | MRR: {pq['mrr']} | Latency: {pq['latency_ms']} ms")

    # 运行消融实验
    run_ablation_study()


if __name__ == "__main__":
    print_report()