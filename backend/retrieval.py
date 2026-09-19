"""检索核心：FULLTEXT 关键词 + 余弦语义 混合打分 → Top-K（支持 module/family/task 过滤）。

这是检索精度（分工 1）的核心改动区。
- 调 embedding 模型 / 切分策略：改 backend/parser.py 的 embed() 与 extract_chunks()
- 调混合权重、加重排序：改本文件的 _rank()
- 评估指标：见 backend/eval_test.py
"""
import json

from backend import db, parser


def rank(req):
    """混合检索核心：FULLTEXT 关键词分 + 余弦语义分，归一化后 0.5/0.5 融合。
    返回 (results, query_vector)。results 每项带 'vector'（调试用，普通搜索剔除）。"""
    qvec = parser.embed(req.query)
    conn = db.get_conn()
    cur = conn.cursor()

    def _query_table(table, type_label, has_parent):
        non_algo = tuple(parser.NON_ALGO_MODULES)
        where = "(c.module NOT IN %s OR c.module='')"
        params = [non_algo]
        if req.module:
            where = "c.module=%s"; params = [req.module]
        if req.family:
            where += " AND c.family=%s"; params.append(req.family)
        if req.task:
            where += " AND c.task=%s"; params.append(req.task)
        parent_sql = ",c.parent_class" if has_parent else ",NULL"
        cur.execute(
            f"SELECT c.id,c.name{parent_sql},c.module,c.family,c.task,"
            "c.math_methods,c.params,c.`references`,c.docstring_math,c.complexity,"
            "c.ref_edges,c.call_edges,c.start_line,c.end_line,c.code_text,c.embedding_json,f.path "
            f"FROM {table} c JOIN code_files f ON c.file_id=f.id WHERE " + where,
            params,
        )
        rows = cur.fetchall()
        if rows:
            cur.execute(
                f"SELECT id, MATCH(code_text,name,embedding_text) AGAINST(%s IN BOOLEAN MODE) AS kw "
                f"FROM {table}", (req.query,)
            )
            kw_map = {r[0]: r[1] for r in cur.fetchall()}
        else:
            kw_map = {}
        out = []
        for r in rows:
            if has_parent:
                cid, ename, parent, module, family, task = r[0], r[1], r[2], r[3], r[4], r[5]
                rest = r[6:]
            else:
                # algorithms 没有 parent_class，用 NULL 占位，unpack 时跳过
                cid, ename, _, module, family, task = r[0], r[1], r[2], r[3], r[4], r[5]
                parent, rest = None, r[6:]
            (math_methods, params_col, references, docstring_math, complexity,
             ref_edges, call_edges, s, e, code, embj, path) = rest
            emb = json.loads(embj) if embj else [0.0] * parser.DIM
            sem = parser.cosine(qvec, emb)
            kw = kw_map.get(cid, 0.0)
            out.append({
                "id": cid, "entity": ename, "type": type_label, "parent_class": parent,
                "module": module, "family": family, "task": task,
                "math_methods": math_methods, "params": params_col, "references": references,
                "docstring_math": docstring_math, "complexity": complexity,
                "ref_edges": ref_edges, "call_edges": call_edges,
                "lines": f"{s}-{e}", "path": path, "code": code,
                "keyword": round(kw, 4), "semantic": round(sem, 4),
                "vector": emb,
            })
        return out

    results = _query_table("algorithms", "class", False) + _query_table("functions", "function", True)
    conn.close()

    # 归一化后加权融合（各取 0.5）
    sem_vals = [x["semantic"] for x in results] or [0]
    kw_vals = [x["keyword"] for x in results] or [0]
    smin, smax = min(sem_vals), max(sem_vals)
    kmin, kmax = min(kw_vals), max(kw_vals)
    for x in results:
        sn = (x["semantic"] - smin) / (smax - smin) if smax > smin else 0
        kn = (x["keyword"] - kmin) / (kmax - kmin) if kmax > kmin else 0
        x["fused"] = round(0.5 * sn + 0.5 * kn, 4)
    results.sort(key=lambda d: d["fused"], reverse=True)
    return results, qvec


def run_search(req):
    """普通搜索：返回 top_k 结果（剔除完整向量）。"""
    results, _ = rank(req)
    for x in results:
        x.pop("vector", None)  # 普通搜索不暴露完整向量
    return {"query": req.query, "results": results[: req.top_k]}


def debug_chunks():
    """像 phpMyAdmin 浏览 algorithms/functions 表一样，列出库内所有 chunk 及其向量头。"""
    conn = db.get_conn()
    cur = conn.cursor()
    out = []
    for table, label in (("algorithms", "class"), ("functions", "function")):
        cur.execute(
            f"SELECT c.id,c.name,c.family,c.task,"
            f"c.embedding_text,c.embedding_json "
            f"FROM {table} c JOIN code_files f ON c.file_id=f.id ORDER BY c.id"
        )
        for r in cur.fetchall():
            cid, ename, family, task, etext, embj = r
            emb = json.loads(embj) if embj else []
            out.append({
                "id": cid, "entity": ename, "type": label,
                "family": family, "task": task,
                "embedding_text": etext or "",
                "vector_head": [round(v, 3) for v in emb[:16]],
                "vector_dim": len(emb),
            })
    conn.close()
    return {"count": len(out), "chunks": out}


def debug_search(req):
    """把一次检索拆开展示：query 向量、每个候选 chunk 的关键词分/余弦分/融合分/向量头。"""
    results, qvec = rank(req)
    return {
        "query": req.query,
        "query_vector_head": [round(v, 3) for v in qvec[:16]],
        "vector_dim": len(qvec),
        "results": [
            {k: v for k, v in x.items() if k != "vector"}
            | {"vector_head": [round(v, 3) for v in x["vector"][:16]]}
            for x in results
        ],
    }
