"""检索核心：FULLTEXT 关键词 + 余弦语义 混合打分 → Top-K（支持 module/family/task 过滤）。

这是检索精度（分工 1）的核心改动区。
- 调 embedding 模型 / 切分策略：改 backend/parser.py 的 embed() 与 extract_chunks()
- 调混合权重、加重排序：改本文件的 _rank()
- 评估指标：见 backend/eval_test.py
"""
import json
import re

from backend import db, parser

# 模块关键词匹配用的英文停用词（避免 of/to/the 等虚词污染名次；与代码 chunk 检索无关）
EN_STOP = set(
    "the a an and or but if then else of to in on at by for with from into over under "
    "is are was were be been being this that these those it its as at into about across "
    "over upon than thus so such do does did have has had will would can could should "
    "may might must not no nor only also we you they he she them their our your his her "
    "using use used via per each both few more most other some any all any".split()
)


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


# ---------------------------------------------------------------------------
# 模块级混合检索（分工 1 · 方案 3）：关键词名次 + README 语义名次 → RRF 融合
# ---------------------------------------------------------------------------
def build_module_cards(cur, rows):
    """把 (mid,name,family,readme,aliases) 行集补全文件数/类数/函数数/示例，返回卡片列表。"""
    out = []
    for mid, name, family, readme, aliases in rows:
        cur.execute("SELECT COUNT(*) FROM code_files WHERE module_id=%s", (mid,))
        file_count = cur.fetchone()[0]
        cur.execute(
            "SELECT COUNT(*) FROM algorithms a JOIN code_files f ON a.file_id=f.id WHERE f.module_id=%s",
            (mid,),
        )
        class_count = cur.fetchone()[0]
        cur.execute(
            "SELECT COUNT(*) FROM functions fn JOIN code_files f ON fn.file_id=f.id WHERE f.module_id=%s",
            (mid,),
        )
        function_count = cur.fetchone()[0]
        cur.execute(
            "SELECT a.name FROM algorithms a JOIN code_files f ON a.file_id=f.id "
            "WHERE f.module_id=%s ORDER BY a.id LIMIT 5",
            (mid,),
        )
        samples = [r[0] for r in cur.fetchall()]
        try:
            alias_list = json.loads(aliases) if aliases else []
        except (json.JSONDecodeError, TypeError):
            alias_list = []
        out.append({
            "name": name,
            "family": family or parser.FAMILY_MAP.get(name, "Other"),
            "file_count": file_count,
            "class_count": class_count,
            "function_count": function_count,
            "samples": samples,
            "readme": readme or "",
            "aliases": alias_list,
            "description": f"{family or parser.FAMILY_MAP.get(name, 'Module')} — "
                           f"{class_count or 0} algorithm classes, {function_count or 0} functions.",
        })
    return out


def module_search(req):
    """模块级混合检索：关键词名次 + README 语义名次，RRF(k=60) 融合。

    流程（与前端展示的链路一致）：
      ① query 分词 → ② 关键词名次（name/family/readme/aliases 命中）与
         ③ 语义名次（query 向量 vs 各模块 readme_embedding 余弦）两条列表
      ④ RRF 融合：score = Σ 1/(k+rank)，只看名次、不归一化分数、不调权重。
    返回按 RRF 降序的模块卡片，并附带 score 与 why（命中原因）。
    """
    q = (req.query or "").strip().lower()
    conn = db.get_conn()
    cur = conn.cursor()
    non_algo = tuple(parser.NON_ALGO_MODULES)
    cur.execute(
        "SELECT id, name, family, readme, aliases, readme_embedding "
        "FROM modules WHERE name NOT IN %s ORDER BY name",
        (non_algo,),
    )
    rows = cur.fetchall()  # (id, name, family, readme, aliases, readme_embedding)

    if not q:
        cards = build_module_cards(cur, [(r[0], r[1], r[2], r[3], r[4]) for r in rows])
        conn.close()
        return {"query": "", "results": cards}

    # ② 关键词名次：基于英文 token + 整段别名包含匹配（带轻量单复数归一）
    q_tokens = [t for t in re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", q)
                if t not in parser.PY_STOP and t not in EN_STOP and len(t) > 1]

    def _kw_hit(tok, hay):
        if tok in hay:
            return True
        # 轻量词干匹配：scale->scaling、normalize->normalization、topic->topics、
        # cluster->clustering、regress->regression 等派生词（最长公共前缀≥4 且长度差≤4）
        # 长度差放宽到 4 才能覆盖 normalize(9)->normalization(13) 这类差 4 的派生词。
        # na_text/rd_text 是 JSON 字符串，单词可能带引号/标点，先剥掉再比
        if len(tok) >= 4:
            for w in hay.split():
                w = w.strip("\"'.,;:()[]{}")
                if len(w) >= 4:
                    cp = 0
                    for a, b in zip(tok, w):
                        if a == b:
                            cp += 1
                        else:
                            break
                    if cp >= 4 and abs(len(tok) - len(w)) <= 4:
                        return True
        return False

    kw_scores = {}
    matched_aliases = {}
    for r in rows:
        mid, name, family, readme, aliases, _ = r
        # 名称/别名命中 = 强信号（模块“就叫这个”），README 命中 = 弱信号（长文里通用词易误命中）
        na_text = " ".join([name, family or "", aliases or ""]).lower()
        rd_text = (readme or "").lower()
        try:
            alias_list = json.loads(aliases) if aliases else []
        except Exception:
            alias_list = []
        ma = [a for a in alias_list if a and (a.lower() in q or q in a.lower())]
        matched_aliases[mid] = ma
        na_hits = sum(1 for t in q_tokens if _kw_hit(t, na_text))
        rd_hits = sum(1 for t in q_tokens if _kw_hit(t, rd_text))
        if q_tokens:
            # 名称/别名命中权重 ×2，README 命中 ×1
            kw_scores[mid] = (2 * na_hits + rd_hits) / (2 * len(q_tokens))
        else:
            kw_scores[mid] = 1.0 if (na_hits or ma) else 0.0
    kw_ranked = sorted([m for m in kw_scores if kw_scores[m] > 0],
                       key=lambda m: kw_scores[m], reverse=True)
    kw_rank = {m: i + 1 for i, m in enumerate(kw_ranked)}

    # ③ 语义名次：query 向量 vs 各模块 README 向量余弦
    qvec = parser.embed(q)
    sem_scores = {}
    for r in rows:
        mid = r[0]
        emb = r[5]
        if emb:
            try:
                sem_scores[mid] = parser.cosine(qvec, json.loads(emb))
            except Exception:
                sem_scores[mid] = -1.0
        else:
            sem_scores[mid] = -1.0
    sem_ranked = sorted([m for m in sem_scores if sem_scores[m] > 0],
                        key=lambda m: sem_scores[m], reverse=True)
    sem_rank = {m: i + 1 for i, m in enumerate(sem_ranked)}

    # ④ RRF 融合（k=60，Cormack et al. 2009）
    K = 60
    rrf = {}
    for r in rows:
        mid = r[0]
        s = 0.0
        if mid in kw_rank:
            s += 1.0 / (K + kw_rank[mid])
        if mid in sem_rank:
            s += 1.0 / (K + sem_rank[mid])
        rrf[mid] = s
    ranked = sorted(rows, key=lambda r: rrf[r[0]], reverse=True)

    top = ranked[: req.top_k] if req.top_k else ranked
    cards = build_module_cards(cur, [(r[0], r[1], r[2], r[3], r[4]) for r in top])
    by_name = {c["name"]: c for c in cards}
    for r in top:
        mid, name = r[0], r[1]
        c = by_name.get(name)
        if not c:
            continue
        reason = []
        ma = matched_aliases.get(mid, [])
        if ma:
            reason.append("alias: " + ", ".join(ma[:3]))
        hay = " ".join([r[1], r[2] or "", r[3] or "", r[4] or ""]).lower()
        mt = [t for t in q_tokens if _kw_hit(t, hay)]
        if mt:
            reason.append("keyword: " + ", ".join(mt[:3]))
        if mid in sem_rank:
            reason.append(f"semantic≈{sem_scores[mid]:.2f}")
        c["score"] = round(rrf[mid], 5)
        c["reason"] = "; ".join(reason) if reason else "name match"
    conn.close()
    return {"query": req.query, "results": cards}
