"""
Code-X-Ray: 检索系统自动化基准评测与消融实验脚本 (Task 2-3)
包含针对 Module-Level 与 Algorithm-Level 检索的定量评测与消融对比：
- 冒烟测试 (Smoke Test)
- Hit@1, Hit@3, Hit@5
- MRR (Mean Reciprocal Rank)
- 端到端延迟性能分析：Mean / P50 / P95 Latency (ms)
- 消融实验 (Ablation Study): Lexical-Only vs Dense-Only vs Hybrid
"""

import copy
import json
import time
from types import SimpleNamespace
from typing import List, Dict, Any

from backend import db, retrieval, parser


# ---------------------------------------------------------------------------
# 评测基准数据集 (Evaluation Benchmark Dataset)
# ---------------------------------------------------------------------------
# 评测基准数据集：支持两阶段级联与 OOD 拦截测试
EVAL_QUERIES = [
    # 1. 库外算法拦截用例 (OOD)
    {"query": "svm", "expected_module": "NOT_IN_REPO", "expected_class": "NOT_IN_REPO"},
    {"query": "pca", "expected_module": "NOT_IN_REPO", "expected_class": "NOT_IN_REPO"},
    {"query": "k-means", "expected_module": "NOT_IN_REPO", "expected_class": "NOT_IN_REPO"},

    # 2. 库内常规及口语/错词算法用例
    {"query": "logistic regression", "expected_module": "linear_models", "expected_class": "LogisticRegression"},
    {"query": "decison tree", "expected_module": "trees", "expected_class": "DecisionTree"},
    {"query": "naive bayes classifier", "expected_module": "linear_models", "expected_class": "GaussianNBClassifier"},
    {"query": "gausian mixture", "expected_module": "gmm", "expected_class": "GMM"},
    {"query": "hidden markov model", "expected_module": "hmm", "expected_class": "MultinomialHMM"},
    {"query": "neural network", "expected_module": "neural_nets", "expected_class": "ReLU"},
    {"query": "reinforcement learning agent", "expected_module": "rl_models", "expected_class": "DynaAgent"},
    {"query": "q learning", "expected_module": "rl_models", "expected_class": "DynaAgent"},
    {"query": "xgboost", "expected_module": "trees", "expected_class": "GradientBoostedDecisionTree"},
]

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
    """results 已由融合分降序排列；检查前 k 个里是否出现期望的 algorithm 或 module。"""
    exp_module = q.get("expected_module") or q.get("module")
    exp_alg = q.get("expected_class") or q.get("algorithm")
    for r in results[:k]:
        entity = r.get("entity") or r.get("algorithm")
        if entity == exp_alg:
            return True
    return False


def _reciprocal_rank(results, q):
    exp_alg = q.get("expected_class") or q.get("algorithm")
    for i, r in enumerate(results, start=1):
        entity = r.get("entity") or r.get("algorithm")
        if entity == exp_alg:
            return 1.0 / i
    return 0.0


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
    
    for q_item in EVAL_QUERIES:
        q = q_item["query"]
        exp_mod = q_item["expected_module"]
        exp_cls = q_item["expected_class"]
        
        t0 = time.perf_counter()
        
        # -----------------------------
        # 阶段 3.1: 模块检索
        # -----------------------------
        m_req = SimpleNamespace(query=q, top_k=1, module="", family="", task="")
        m_resp = retrieval.module_search(m_req)
        
        is_ood = m_resp.get("not_in_repo", False)
        m_results = m_resp.get("results", [])
        actual_mod = m_results[0]["name"] if (m_results and not is_ood) else ("NOT_IN_REPO" if is_ood else None)
        
        # 检验 3.1 模块是否符合 (库外拦截成功 或 模块匹配)
        s1_ok = (exp_mod == "NOT_IN_REPO" and is_ood) or (actual_mod == exp_mod)
        if s1_ok:
            stage1_hits += 1
            
        # -----------------------------
        # 阶段 3.2: 模块内类检索
        # -----------------------------
        s2_hit1 = False
        s2_hit3 = False
        rr = 0.0
        top1_entity = None
        
        if is_ood:
            # 库外算法成功拦截，流程安全终止
            top1_entity = "NOT_IN_REPO (Intercepted)"
            if exp_cls == "NOT_IN_REPO":
                s2_hit1 = True
                s2_hit3 = True
                rr = 1.0
        elif actual_mod:
            # 3.1 命中模块，将模块名注入 class_search
            c_req = SimpleNamespace(query=q, top_k=3, module=actual_mod, family="", task="")
            c_resp = retrieval.class_search(c_req)
            c_results = c_resp.get("results", [])
            
            top3_entities = [c.get("entity") for c in c_results[:3]]
            top1_entity = top3_entities[0] if top3_entities else None
            
            if top1_entity == exp_cls:
                s2_hit1 = True
            if exp_cls in top3_entities:
                s2_hit3 = True
                rank = top3_entities.index(exp_cls) + 1
                rr = 1.0 / rank
                
        t1 = time.perf_counter()
        elapsed_ms = (t1 - t0) * 1000.0
        latencies.append(elapsed_ms)
        
        stage2_top1 += int(s2_hit1)
        stage2_top3 += int(s2_hit3)
        rr_sum += rr
        
        per_query.append({
            "query": q,
            "expected": f"{exp_mod}::{exp_cls}",
            "actual_mod": actual_mod,
            "top1_result": top1_entity,
            "stage1_ok": s1_ok,
            "stage2_hit1": s2_hit1,
            "stage2_hit3": s2_hit3,
            "mrr": round(rr, 4),
            "latency_ms": round(elapsed_ms, 2)
        })
        
    n = len(EVAL_QUERIES)
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


def evaluate_modules():
    """跑模块级评测集，记录准确率与端到端 RRF 检索耗时。"""
    per_query = []
    rr_sum = 0.0
    h1 = h3 = h5 = 0
    latencies = []

    for q in MODULE_EVAL_QUERIES:
        t0 = time.perf_counter()
        res = retrieval.module_search(SimpleNamespace(query=q["query"], top_k=13))
        t1 = time.perf_counter()

        elapsed_ms = (t1 - t0) * 1000.0
        latencies.append(elapsed_ms)

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


def run_ablation_study():
    """
    消融实验套件：
    针对算法级与模块级，分别测试 Lexical-Only、Dense-Only 与 Hybrid 的检索质量。
    输出论文标准格式的对比表格。
    """
    print("\n" + "=" * 65)
    print("4. 消融实验评估 (Ablation Study: Lexical vs Dense vs Hybrid)")
    print("=" * 65)

    # -------------------------------------------------------------
    # A. 算法级消融评测 (Algorithm-Level Ablation)
    # -------------------------------------------------------------
    algo_modes = ["Lexical Only (FULLTEXT)", "Dense Only (Embedding)", "Hybrid (0.5/0.5)"]
    algo_metrics = {m: {"hits1": 0, "hits3": 0, "hits5": 0, "rr_sum": 0.0} for m in algo_modes}

    for q in EVAL_QUERIES:
        # 跳过库外未收录算法（OOD 不参与单阶段库内排序消融）
        if q.get("expected_class") == "NOT_IN_REPO" or q.get("expected_module") == "NOT_IN_REPO":
            continue

        raw_results, _ = retrieval.rank(_req(q, top_k=30))

        for mode in algo_modes:
            cand = copy.deepcopy(raw_results)
            if mode == "Lexical Only (FULLTEXT)":
                cand.sort(key=lambda d: d.get("keyword", 0.0), reverse=True)
            elif mode == "Dense Only (Embedding)":
                cand.sort(key=lambda d: d.get("semantic", -1.0), reverse=True)
            else:  # Hybrid
                cand.sort(key=lambda d: d.get("fused", 0.0), reverse=True)

            rr = _reciprocal_rank(cand, q)
            algo_metrics[mode]["rr_sum"] += rr
            if _hit_at(cand, q, 1): algo_metrics[mode]["hits1"] += 1
            if _hit_at(cand, q, 3): algo_metrics[mode]["hits3"] += 1
            if _hit_at(cand, q, 5): algo_metrics[mode]["hits5"] += 1

    n_algo = len(EVAL_QUERIES)
    print("\n[算法级消融对比 - Algorithm Level]")
    print(f"{'Retrieval Mode':<28} | {'Hit@1':<8} | {'Hit@3':<8} | {'Hit@5':<8} | {'MRR':<8}")
    print("-" * 68)
    for m in algo_modes:
        h1 = (algo_metrics[m]["hits1"] / n_algo) * 100
        h3 = (algo_metrics[m]["hits3"] / n_algo) * 100
        h5 = (algo_metrics[m]["hits5"] / n_algo) * 100
        mrr = algo_metrics[m]["rr_sum"] / n_algo
        print(f"{m:<28} | {h1:>6.2f}% | {h3:>6.2f}% | {h5:>6.2f}% | {mrr:>8.4f}")

    # -------------------------------------------------------------
    # B. 模块级消融评测 (Module-Level Ablation)
    # -------------------------------------------------------------
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
        
        # 1. 词法打分
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

        # 2. 语义打分
        qvec = parser.embed(query_text)
        sem_scores = {}
        for r in rows:
            emb = r[5]
            sem_scores[r[0]] = parser.cosine(qvec, json.loads(emb)) if emb else -1.0
        sem_ranked_rows = sorted(rows, key=lambda r: sem_scores[r[0]], reverse=True)

        # 3. 完整 RRF
        hybrid_res = retrieval.module_search(SimpleNamespace(query=q["query"], top_k=20))["results"]

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
    print("\n[模块级消融对比 - Module Level]")
    print(f"{'Retrieval Mode':<28} | {'Hit@1':<8} | {'Hit@3':<8} | {'Hit@5':<8} | {'MRR':<8}")
    print("-" * 68)
    for m in mod_modes:
        h1 = (mod_metrics[m]["hits1"] / n_mod) * 100
        h3 = (mod_metrics[m]["hits3"] / n_mod) * 100
        h5 = (mod_metrics[m]["hits5"] / n_mod) * 100
        mrr = mod_metrics[m]["rr_sum"] / n_mod
        print(f"{m:<28} | {h1:>6.2f}% | {h3:>6.2f}% | {h5:>6.2f}% | {mrr:>8.4f}")


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