"""检索核心：FULLTEXT 关键词 + 余弦语义 混合打分 → Top-K（支持 module/family/task 过滤）。

这是检索精度（分工 1）的核心改动区。
- 调 embedding 模型 / 切分策略：改 backend/parser.py 的 embed() 与 extract_chunks()
- 调混合权重、加重排序：改本文件的 _rank()
- 评估指标：见 tests/eval_test.py
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


# 查询扩展：把缩写 / 口语词映射为代码库里的标准全称，抹平词汇鸿沟（Gemini 建议 #4）。
# 同时作用于语义向量（embed）与关键词（FULLTEXT），零额外耗时、不换模型。
SYNONYMS = {
    "pca": "principal component analysis",
    "svm": "support vector machine",
    "hmm": "hidden markov model",
    "gmm": "gaussian mixture model",
    "kmeans": "k means clustering",
    "k-means": "k means clustering",
    "lda": "latent dirichlet allocation topic model",
    "rbm": "restricted boltzmann machine",
    "naive bayes": "naive bayes gaussian classifier",
    "backprop": "backpropagation",
    "autoencoder": "autoencoder variational neural network",
}


# 仓库外算法（本仓库 numpy-ml 未收录，但名称高度标准化、常被查询）的提示词典。
# 命中后做二次 DB 确认，确认库里确实没有才提示“未收录”，避免误伤已收录算法。
NOT_IN_REPO = {
    "svm": "Support Vector Machine (SVM)",
    "support vector machine": "Support Vector Machine (SVM)",
    "support vector": "Support Vector Machine (SVM)",
    "pca": "Principal Component Analysis (PCA)",
    "principal component analysis": "Principal Component Analysis (PCA)",
    "principal component": "Principal Component Analysis (PCA)",
    "kmeans": "K-Means Clustering",
    "k-means": "K-Means Clustering",
    "k-means clustering": "K-Means Clustering",
    "k means clustering": "K-Means Clustering",
}


def detect_not_in_repo(query):
    """若查询指向一个本仓库（numpy-ml）未收录、但广为人知的算法，返回其标准名称；否则返回 None。

    判定两步走：
      1) 词面命中 NOT_IN_REPO 词典（仅收录确定不在库中的外部算法）；
      2) 二次确认 DB 中 algorithms / modules 的 name 确实不含该算法的核心词，
         确认无误才提示，避免把已收录算法误判为未收录。
    """
    q = (query or "").strip().lower()
    if not q:
        return None
    matched = None
    for key, display in NOT_IN_REPO.items():
        if re.search(r"(?<![a-z0-9])" + re.escape(key) + r"(?![a-z0-9])", q):
            matched = display
            break
    if not matched:
        return None
    # 二次确认：库里是否真的没有同名/近名实体
    core = re.sub(r"[^a-z0-9 ]", " ", q)
    core_tokens = [t for t in core.split() if len(t) >= 4]
    if not core_tokens:
        # 缩写（svm/pca/kmeans）核心词太短，无法用 name 反查，直接信任词典
        return matched
    like = " OR ".join(["LOWER(name) LIKE %s"] * len(core_tokens))
    params = [f"%{t}%" for t in core_tokens]
    conn = db.get_conn()
    cur = conn.cursor()
    try:
        cur.execute(f"SELECT 1 FROM algorithms WHERE {like} LIMIT 1", params)
        if cur.fetchone():
            return None
        cur.execute(f"SELECT 1 FROM modules WHERE {like} LIMIT 1", params)
        if cur.fetchone():
            return None
    finally:
        conn.close()
    return matched


def _norm(s):
    """归一化：去非字母数字、转小写，用于类名/查询的包含匹配。"""
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def expand_query(q):
    """轻量同义词扩展：命中缩写/口语词时，把对应全称追加进查询串。"""
    q = (q or "").strip().lower()
    extra = []
    for k, v in SYNONYMS.items():
        if k in q and v not in q:
            extra.append(v)
    return (q + " " + " ".join(extra)).strip()


def sqlite_keyword_score(text, query):
    """Lightweight per-row keyword score used when MySQL FULLTEXT is unavailable."""
    q_tokens = parser.tokenize(expand_query(query))
    if not q_tokens:
        return 0.0
    hay = (text or "").lower()
    score = 0.0
    for t in q_tokens:
        if t in hay:
            score += 1.0
    phrase = (query or "").strip().lower()
    if phrase and phrase in hay:
        score += 2.0
    return score


# 算法“昵称/黑话”→具体类名 token：口语化查询（如 q learning）直接拉满到具体算法类，
# 既提升 FULLTEXT 关键词命中，也触发 3.2 的类名命中加权(*1.2)。补 SYNONYMS（缩写类）之外的缺口。
NICKNAME = {
    "q learning": "dynaqgent",
    "q-learning": "dynaqgent",
    "qlearning": "dynaqgent",
    "temporal difference": "temporaldifferenceagent",
    "temporal-difference": "temporaldifferenceagent",
    "monte carlo": "montecarloagent",
    "monte-carlo": "montecarloagent",
}

# 抽象基类 / 工具类：不是用户想要的“算法”，应在排序里降权，避免抢在具体算法前面。
# 这些类的 docstring 描述宽泛（如 "base class for agents"），语义上极易压过具体算法。
GENERIC_CLASSES = {
    "AgentBase", "Trainer", "IHT", "MeanBaseEstimator", "LayerBase",
    "Node", "Leaf",  # 树的内部结构节点，非用户面向的算法
}

_VOCAB = None  # 懒加载：算法/模块名拆出的词表，用于拼写纠错


def _vocab():
    """从库里取出所有算法/模块名，按驼峰+非字母数字拆词，构建纠错词表（进程内缓存一次）。"""
    global _VOCAB
    if _VOCAB is not None:
        return _VOCAB
    conn = db.get_conn()
    cur = conn.cursor()
    vocab = set()
    try:
        for sql in ("SELECT name FROM algorithms", "SELECT name FROM modules"):
            cur.execute(sql)
            for (n,) in cur.fetchall():
                for piece in re.findall(r"[A-Z]?[a-z]+|[A-Z]+(?![a-z])", n or ""):
                    vocab.add(piece.lower())
    finally:
        conn.close()
    _VOCAB = vocab
    return vocab


def _edit_dist(a, b):
    """标准 Levenshtein 编辑距离（带长度差早停）。"""
    m, n = len(a), len(b)
    if abs(m - n) > 2:
        return 99
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev, dp[0] = dp[0], i
        for j in range(1, n + 1):
            cur = dp[j]
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[j] = min(dp[j] + 1, dp[j - 1] + 1, prev + cost)
            prev = cur
    return dp[n]


def _spell_correct(tok, vocab):
    """对 token 做轻量拼写纠错：长度差≤2 且编辑距离≤1（长词放宽到≤2）时，映射到词表最近词。"""
    if tok in vocab or len(tok) < 4:
        return tok
    best, best_d = tok, 99
    max_d = 1 if len(tok) <= 5 else 2
    for w in vocab:
        if abs(len(w) - len(tok)) > 2:
            continue
        d = _edit_dist(tok, w)
        if d <= max_d and d < best_d:
            best, best_d = w, d
    return best


def normalize_query(q):
    """查询归一化：昵称/黑话展开为具体类名 token + 逐 token 拼写纠错。"""
    q = (q or "").strip().lower()
    extra = []
    for k, v in NICKNAME.items():
        if k in q and v not in q:
            extra.append(v)
    q2 = (q + " " + " ".join(extra)).strip()
    vocab = _vocab()
    fixed = [_spell_correct(t, vocab) for t in re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", q2)]
    return " ".join(fixed)


def preprocess_query(q):
    """检索统一入口：先拼写纠错+昵称展开，再做同义词(SYNONYMS)扩展。供 3.1/3.2 共用。"""
    return expand_query(normalize_query(q))


def rank(req):
    """混合检索核心：FULLTEXT 关键词分 + 余弦语义分，归一化后 0.5/0.5 融合。
    返回 (results, query_vector)。results 每项带 'vector'（调试用，普通搜索剔除）。"""
    qvec = parser.embed(expand_query(req.query))
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
            if db.is_sqlite():
                kw_map = {
                    r[0]: sqlite_keyword_score(" ".join([str(r[1] or ""), str(r[-3] or "")]), req.query)
                    for r in rows
                }
            else:
                cur.execute(
                    f"SELECT id, MATCH(code_text,name,embedding_text) AGAINST(%s IN BOOLEAN MODE) AS kw "
                    f"FROM {table}", (expand_query(req.query),)
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


def _one_line_meaning(code_text, embedding_text, docstring_math):
    """从 chunk 的 docstring / embedding_text / docstring_math 中抽取一句可读含义，用于函数清单。"""
    if docstring_math:
        first = docstring_math.strip().splitlines()[0].strip()
        if len(first) >= 8:
            return first[:180]
    if code_text:
        # 抽取第一个三引号 docstring 的首句（最贴近人工注释原意）
        for quote in ('"""', "'''"):
            start = code_text.find(quote)
            if start != -1:
                end = code_text.find(quote, start + 3)
                if end != -1:
                    doc = code_text[start + 3:end].strip()
                    if doc:
                        parts = re.split(r"(?<=[.!?])\s+", doc.replace("\n", " "))
                        sent = parts[0].strip()
                        if len(sent) >= 8:
                            return sent[:180]
    if embedding_text:
        # embedding_text 形如 "Family algorithm for task. Class name: Name. <docstring前两句>. Key parameters: ..."
        rest = re.sub(r"^.*? algorithm for .*?\. Class name: .*?\.\s*", "", embedding_text)
        m = re.match(r"([^\.\n]{5,}?[\.!?])(?:\s|$)", rest)
        if m:
            sent = m.group(1).strip()
            if not sent.lower().startswith("key parameters") and len(sent) >= 8:
                return sent[:180]
    return ""


def class_search(req):
    """3.2 新设计：只返回分类（完整算法），每个分类附带其全部成员函数。
    游离函数（不属于任何分类）作为 'free_functions' 单独返回，仅在相关时列出。"""
    # 默认 keyword 权重 0.2，semantic 0.8；由 eval 网格搜索确定，eval 脚本可覆盖
    kw_weight = getattr(req, "kw_weight", 0.2)
    if db.is_sqlite() and not hasattr(req, "kw_weight"):
        # SQLite demo mode uses hash embeddings instead of the transformer model,
        # so keyword evidence should dominate the default user-facing search.
        kw_weight = 0.85
    return _class_search_weighted(req, kw_weight=kw_weight)


def _class_search_weighted(req, kw_weight=0.2):
    """3.2 检索内部实现，支持 keyword/semantic 融合权重调参。

    kw_weight: keyword 通道权重；semantic 权重 = 1 - kw_weight。
    """
    # 仓库外算法：未收录提示优先于正常检索（避免返回语义替身误导用户）
    not_in = detect_not_in_repo(req.query)
    if not_in:
        return {
            "query": req.query,
            "not_in_repo": True,
            "algorithm": not_in,
            "message": f"本仓库（numpy-ml）未收录该算法：{not_in}。",
            "results": [],
            "free_functions": [],
        }
    qvec = parser.embed(preprocess_query(req.query))
    conn = db.get_conn()
    cur = conn.cursor()

    non_algo = tuple(parser.NON_ALGO_MODULES)
    where = "(c.module NOT IN %s OR c.module='')"; params = [non_algo]
    if req.module:
        where = "c.module=%s"; params = [req.module]
    if req.family:
        where += " AND c.family=%s"; params.append(req.family)
    if req.task:
        where += " AND c.task=%s"; params.append(req.task)

    cur.execute(
        "SELECT c.id,c.name,c.module,c.family,c.task,c.math_methods,c.params,c.`references`,"
        "c.docstring_math,c.complexity,c.ref_edges,c.call_edges,c.start_line,c.end_line,"
        "c.code_text,c.embedding_text,c.embedding_json,f.path "
        "FROM algorithms c JOIN code_files f ON c.file_id=f.id WHERE " + where,
        params,
    )
    rows = cur.fetchall()

    if rows:
        if db.is_sqlite():
            kw_map = {
                r[0]: sqlite_keyword_score(" ".join([str(r[1] or ""), str(r[14] or ""), str(r[15] or "")]), req.query)
                for r in rows
            }
        else:
            cur.execute(
                "SELECT id, MATCH(code_text,name,embedding_text) AGAINST(%s IN BOOLEAN MODE) AS kw "
                "FROM algorithms", (preprocess_query(req.query),)
            )
            kw_map = {r[0]: r[1] for r in cur.fetchall()}
    else:
        kw_map = {}

    results = []
    for r in rows:
        (cid, name, module, family, task, math_methods, params_col, references,
         docstring_math, complexity, ref_edges, call_edges, s, e, code, etext, embj, path) = r
        emb = json.loads(embj) if embj else [0.0] * parser.DIM
        sem = parser.cosine(qvec, emb)
        kw = kw_map.get(cid, 0.0)
        results.append({
            "id": cid, "entity": name, "type": "class", "parent_class": None,
            "module": module, "family": family, "task": task,
            "math_methods": json.loads(math_methods) if math_methods else [],
            "params": [p.strip() for p in params_col.split(",") if p.strip()] if params_col else [],
            "references": json.loads(references) if references else [],
            "docstring_math": docstring_math or "",
            "complexity": complexity,
            "ref_edges": ref_edges,
            "call_edges": call_edges,
            "lines": f"{s}-{e}", "path": path, "code": code,
            "keyword": round(kw, 4), "semantic": round(sem, 4),
        })

    sem_vals = [x["semantic"] for x in results] or [0]
    kw_vals = [x["keyword"] for x in results] or [0]
    smin, smax = min(sem_vals), max(sem_vals)
    kmin, kmax = min(kw_vals), max(kw_vals)
    sem_weight = 1.0 - kw_weight
    qnorm = _norm(preprocess_query(req.query))
    for x in results:
        sn = (x["semantic"] - smin) / (smax - smin) if smax > smin else 0
        kn = (x["keyword"] - kmin) / (kmax - kmin) if kmax > kmin else 0
        fused = kw_weight * kn + sem_weight * sn
        # 类名命中加权（Gemini 建议 #2）：查询里出现候选类名（或反之），轻量上浮，
        # 抑制基类/通用类抢位（如 k-means 本应落到 KMeans，而非 MeanBaseEstimator）。
        nnorm = _norm(x["entity"])
        if nnorm and (nnorm in qnorm or qnorm in nnorm):
            fused *= 1.2
        # 基类/工具类降权：这些不是用户想要的算法，避免抢在具体算法前面（修 #12/#13/#7）
        if x["entity"] in GENERIC_CLASSES:
            fused *= 0.85
        x["fused"] = round(fused, 4)
    results.sort(key=lambda d: d["fused"], reverse=True)
    top_classes = results[:req.top_k]

    # 拉取每个分类的成员函数
    for cls in top_classes:
        cur.execute(
            "SELECT name, docstring_math, embedding_text, code_text FROM functions "
            "WHERE module=%s AND parent_class=%s ORDER BY start_line",
            (cls["module"], cls["entity"]),
        )
        cls["functions"] = [
            {"name": fname, "meaning": _one_line_meaning(fcode or "", etxt or "", fdoc or "")}
            for fname, fdoc, etxt, fcode in cur.fetchall()
        ]

    # 游离函数：仅当与查询相关时才列出；module 过滤与分类一致
    free_functions = []
    free_where = "(c.parent_class IS NULL OR c.parent_class='') AND (c.module NOT IN %s OR c.module='')"
    free_params = [non_algo]
    if req.module:
        free_where += " AND c.module=%s"; free_params.append(req.module)
    if req.family:
        free_where += " AND c.family=%s"; free_params.append(req.family)
    if req.task:
        free_where += " AND c.task=%s"; free_params.append(req.task)
    cur.execute(
        "SELECT c.id,c.name,c.module,c.family,c.task,c.docstring_math,c.embedding_text,"
        "c.embedding_json,c.code_text,c.start_line,c.end_line,f.path "
        "FROM functions c JOIN code_files f ON c.file_id=f.id WHERE " + free_where,
        free_params,
    )
    free_rows = cur.fetchall()
    if free_rows:
        if db.is_sqlite():
            free_kw_map = {
                r[0]: sqlite_keyword_score(" ".join([str(r[1] or ""), str(r[6] or ""), str(r[8] or "")]), req.query)
                for r in free_rows
            }
        else:
            kw_where = "parent_class IS NULL OR parent_class=''"
            kw_params = []
            if req.module:
                kw_where += " AND module=%s"; kw_params.append(req.module)
            cur.execute(
                f"SELECT id, MATCH(code_text,name,embedding_text) AGAINST(%s IN BOOLEAN MODE) AS kw "
                f"FROM functions WHERE {kw_where}",
                (expand_query(req.query),) + tuple(kw_params),
            )
            free_kw_map = {r[0]: r[1] for r in cur.fetchall()}
    else:
        free_kw_map = {}

    free_results = []
    for r in free_rows:
        (fid, name, module, family, task, fdoc, femb_text, embj, code, s, e, path) = r
        emb = json.loads(embj) if embj else [0.0] * parser.DIM
        sem = parser.cosine(qvec, emb)
        kw = free_kw_map.get(fid, 0.0)
        free_results.append({
            "id": fid, "entity": name, "type": "function", "module": module,
            "family": family, "task": task, "path": path, "lines": f"{s}-{e}",
            "code": code, "meaning": _one_line_meaning(code or "", femb_text or "", fdoc or ""),
            "keyword": round(kw, 4), "semantic": round(sem, 4),
        })

    if free_results:
        fsem = [x["semantic"] for x in free_results] or [0]
        fkw = [x["keyword"] for x in free_results] or [0]
        fsmin, fsmax = min(fsem), max(fsem)
        fkmin, fkmax = min(fkw), max(fkw)
        for x in free_results:
            sn = (x["semantic"] - fsmin) / (fsmax - fsmin) if fsmax > fsmin else 0
            kn = (x["keyword"] - fkmin) / (fkmax - fkmin) if fkmax > fkmin else 0
            x["fused"] = round(kw_weight * kn + sem_weight * sn, 4)
        free_results.sort(key=lambda d: d["fused"], reverse=True)
        # 只保留真正相关的：关键词命中或语义分>0.3
        free_functions = [
            x for x in free_results
            if x["keyword"] > 0 or x["semantic"] > 0.3
        ][:5]

    conn.close()
    return {"query": req.query, "results": top_classes, "free_functions": free_functions}


def run_search(req):
    """3.2 前端接口：返回分类（完整算法）及每个分类的成员函数，游离函数单独列出。"""
    return class_search(req)


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
    q_pp = preprocess_query(req.query)  # 拼写纠错 + 昵称展开 + SYNONYMS 扩展，3.2 已用，3.1 此处对齐
    # 仓库外算法：未收录提示优先于正常检索（避免返回语义替身误导用户）
    not_in = detect_not_in_repo(req.query)
    if not_in:
        return {
            "query": req.query,
            "not_in_repo": True,
            "algorithm": not_in,
            "message": f"本仓库（numpy-ml）未收录该算法：{not_in}。",
            "results": [],
        }
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
    q_tokens = [t for t in re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", q_pp)
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
        ma = [a for a in alias_list if a and (a.lower() in q_pp or q_pp in a.lower())]
        matched_aliases[mid] = ma
        na_hits = sum(1 for t in q_tokens if _kw_hit(t, na_text))
        rd_hits = sum(1 for t in q_tokens if _kw_hit(t, rd_text))
        if q_tokens:
            # 名称/别名命中权重 ×2，README 命中 ×1；整短语别名命中是强信号，额外加权，
            # 避免具体算法被“共享关键词”模块（如 naive bayes 被 gaussian 的 gmm 抢走）挤掉。
            bonus = 5.0 if ma else 0.0
            kw_scores[mid] = (2 * na_hits + rd_hits + bonus) / (2 * len(q_tokens))
        else:
            kw_scores[mid] = 1.0 if (na_hits or ma) else 0.0
    kw_ranked = sorted([m for m in kw_scores if kw_scores[m] > 0],
                       key=lambda m: kw_scores[m], reverse=True)
    kw_rank = {m: i + 1 for i, m in enumerate(kw_ranked)}

    # ③ 语义名次：query 向量 vs 各模块 README 向量余弦
    qvec = parser.embed(q_pp)
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
    # 整短语别名命中：决定性加权，压过语义/关键词噪声（如 naive bayes 不应被 gaussian 的 gmm 抢走）。
    # RRF 单路最大约 1/(60+1)≈0.016，0.2 的加成足以让别名匹配模块稳居第一。
    for r in rows:
        if matched_aliases.get(r[0]):
            rrf[r[0]] += 0.2
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
