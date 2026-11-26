"""Retrieval core: FULLTEXT keyword + cosine semantic hybrid scoring -> Top-K (with module/family/task filtering).

This is the core change area for retrieval accuracy (task 1).
- To tune the embedding model / splitting strategy: change embed() and extract_chunks() in backend/parser.py
- To tune hybrid weights / boost ranking: change _rank() in this file
- Evaluation metrics: see tests/eval_test.py
"""
import json
import re

from backend import db, parser
from backend.embedding_index import ensure_compatible, embed_query

# English stopwords for module keyword matching (avoid function words such as of/to/the polluting ranks; unrelated to code chunk retrieval)
EN_STOP = set(
    "the a an and or but if then else of to in on at by for with from into over under "
    "is are was were be been being this that these those it its as at into about across "
    "over upon than thus so such do does did have has had will would can could should "
    "may might must not no nor only also we you they he she them their our your his her "
    "using use used via per each both few more most other some any all any".split()
)


# Query expansion: map abbreviations / colloquial terms to standard full names in the codebase, bridging the vocabulary gap (Gemini suggestion #4).
# Applies to both semantic vectors (embed) and keywords (FULLTEXT), with no extra latency and no model change.
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


# Hint dictionary for algorithms outside this repository (not in numpy-ml, but highly standardized and frequently queried).
# On a match, do a second database check; only report "not in repo" if the algorithm is truly absent, to avoid false negatives for indexed algorithms.
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
    """If the query refers to a well-known algorithm not in this repository (numpy-ml), return its standard name; otherwise return None.

    Two-step decision:
      1) literal match against the NOT_IN_REPO dictionary (only external algorithms known to be absent);
      2) a second database check confirming that the name fields in algorithms / modules do not contain
         the algorithm's core term. Only report it once confirmed, to avoid misclassifying an indexed algorithm as not in repo.
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
    # Second check: is there really no entity with the same or a similar name in the database?
    core = re.sub(r"[^a-z0-9 ]", " ", q)
    core_tokens = [t for t in core.split() if len(t) >= 4]
    if not core_tokens:
        # Abbreviations (svm/pca/kmeans) have core terms too short for a name lookup; trust the dictionary directly
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
    """Normalize: strip non-alphanumerics, lowercase, for containment matching of class names/queries."""
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())


def expand_query(q):
    """Lightweight synonym expansion: append the full name to the query when an abbreviation/colloquial term matches."""
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


# Algorithm "nicknames/slang" -> concrete class name tokens: map colloquial queries (e.g. q learning) directly to
# concrete algorithm classes, improving FULLTEXT keyword hits and triggering the 3.2 class-name boost (*1.2).
# Fills the gap beyond SYNONYMS (which handles abbreviations).
NICKNAME = {
    "q learning": "dynaqgent",
    "q-learning": "dynaqgent",
    "qlearning": "dynaqgent",
    "temporal difference": "temporaldifferenceagent",
    "temporal-difference": "temporaldifferenceagent",
    "monte carlo": "montecarloagent",
    "monte-carlo": "montecarloagent",
}

# Abstract base classes / utility classes: not the "algorithms" users want; downweight them in ranking so they
# do not outrank concrete algorithms. Their docstrings are broad (e.g. "base class for agents"), so semantically
# they can easily overwhelm concrete algorithms.
GENERIC_CLASSES = {
    "AgentBase", "Trainer", "IHT", "MeanBaseEstimator", "LayerBase",
    "Node", "Leaf",  # Internal structural nodes of trees, not user-facing algorithms
}

_VOCAB = None  # Lazily loaded vocabulary split from algorithm/module names, used for spell correction


def _vocab():
    """Fetch all algorithm/module names from the database, split on camelCase + non-alphanumerics, and build a spell-correction vocabulary (cached once per process)."""
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
    """Standard Levenshtein edit distance (with early stop on length difference)."""
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
    """Lightweight spell correction for a token: map it to the nearest vocabulary word when the length differs by at most 2 and edit distance is at most 1 (at most 2 for long words)."""
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
    """Query normalization: expand nicknames/slang into concrete class name tokens + per-token spell correction."""
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
    """Unified retrieval entry point: spell correction + nickname expansion first, then synonym (SYNONYMS) expansion. Shared by 3.1/3.2."""
    return expand_query(normalize_query(q))


def rank(req):
    """Hybrid retrieval core: FULLTEXT keyword score + cosine semantic score, normalized then fused 0.5/0.5.
    Returns (results, query_vector). Each result carries 'vector' (for debugging; stripped from normal search)."""
    qvec = embed_query(expand_query(req.query))
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
                # algorithms has no parent_class; use NULL as a placeholder and skip it when unpacking
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

    # Weighted fusion after normalization (0.5 each)
    sem_vals = [x["semantic"] for x in results] or [0]
    kw_vals = [x["keyword"] for x in results] or [0]
    smin, smax = min(sem_vals), max(sem_vals)
    kmin, kmax = min(kw_vals), max(kw_vals)
    for x in results:
        sn = (x["semantic"] - smin) / (smax - smin) if smax > smin else max(0, x["semantic"])
        kn = (x["keyword"] - kmin) / (kmax - kmin) if kmax > kmin else float(x["keyword"] > 0)
        x["fused"] = round(0.5 * sn + 0.5 * kn, 4)
    results.sort(key=lambda d: d["fused"], reverse=True)
    return results, qvec


def _one_line_meaning(code_text, embedding_text, docstring_math):
    """Extract one readable meaning sentence from a chunk's docstring / embedding_text / docstring_math, for the function list."""
    if docstring_math:
        first = docstring_math.strip().splitlines()[0].strip()
        if len(first) >= 8:
            return first[:180]
    if code_text:
        # Extract the first sentence of the first triple-quoted docstring (closest to the original human comment)
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
        # embedding_text looks like "Family algorithm for task. Class name: Name. <first two docstring sentences>. Key parameters: ..."
        rest = re.sub(r"^.*? algorithm for .*?\. Class name: .*?\.\s*", "", embedding_text)
        m = re.match(r"([^\.\n]{5,}?[\.!?])(?:\s|$)", rest)
        if m:
            sent = m.group(1).strip()
            if not sent.lower().startswith("key parameters") and len(sent) >= 8:
                return sent[:180]
    return ""


def class_search(req):
    """3.2 new design: return only classes (complete algorithms), each with all its member functions.
    Free functions (not belonging to any class) are returned separately as 'free_functions', listed only when relevant."""
    # Default keyword weight 0.2, semantic 0.8; determined by eval grid search, overridable by eval scripts
    kw_weight = getattr(req, "kw_weight", 0.2)
    if parser.embedding_config()["backend"] == "hash" and not hasattr(req, "kw_weight"):
        kw_weight = 0.85
    return _class_search_weighted(req, kw_weight=kw_weight)


def _class_search_weighted(req, kw_weight=0.2):
    """Internal implementation of 3.2 retrieval, supporting tuning of the keyword/semantic fusion weight.

    kw_weight: weight of the keyword channel; semantic weight = 1 - kw_weight.
    """
    # Algorithms outside this repository: the "not in repo" hint takes priority over normal retrieval (avoid misleading users with semantic substitutes)
    not_in = detect_not_in_repo(req.query)
    if not_in:
        return {
            "query": req.query,
            "not_in_repo": True,
            "algorithm": not_in,
            "message": f"This algorithm is not in this repository (numpy-ml): {not_in}.",
            "results": [],
            "free_functions": [],
        }
    qvec = embed_query(preprocess_query(req.query))
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
        sn = (x["semantic"] - smin) / (smax - smin) if smax > smin else max(0, x["semantic"])
        kn = (x["keyword"] - kmin) / (kmax - kmin) if kmax > kmin else float(x["keyword"] > 0)
        fused = kw_weight * kn + sem_weight * sn
        # Class-name hit boost (Gemini suggestion #2): when a candidate class name appears in the query (or vice versa),
        # lightly raise its rank and suppress base/generic classes from taking the top spot
        # (e.g. k-means should land on KMeans, not MeanBaseEstimator).
        nnorm = _norm(x["entity"])
        if nnorm and (nnorm in qnorm or qnorm in nnorm):
            fused *= 1.2
        # Downrank base/utility classes: they are not the algorithms users want; avoid them outranking concrete algorithms (fixes #12/#13/#7)
        if x["entity"] in GENERIC_CLASSES:
            fused *= 0.85
        x["fused"] = round(fused, 4)
    results.sort(key=lambda d: d["fused"], reverse=True)
    top_classes = results[:req.top_k]

    # Fetch the member functions of each family
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

    # Free functions: list only when relevant to the query; module filtering matches families
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
            sn = (x["semantic"] - fsmin) / (fsmax - fsmin) if fsmax > fsmin else max(0, x["semantic"])
            kn = (x["keyword"] - fkmin) / (fkmax - fkmin) if fkmax > fkmin else float(x["keyword"] > 0)
            x["fused"] = round(kw_weight * kn + sem_weight * sn, 4)
        free_results.sort(key=lambda d: d["fused"], reverse=True)
        # Keep only truly relevant ones: keyword hit or semantic score > 0.3
        free_functions = [
            x for x in free_results
            if x["keyword"] > 0 or x["semantic"] > 0.3
        ][:5]

    conn.close()
    return {"query": req.query, "results": top_classes, "free_functions": free_functions}


def run_search(req):
    """3.2 frontend endpoint: return families (full algorithms) with their member functions, and list free functions separately."""
    return class_search(req)


def debug_chunks():
    """List all chunks in the repository with their vector headers, like browsing the algorithms/functions tables in phpMyAdmin."""
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
    """Break down a retrieval run: query vector, and each candidate chunk's keyword score / cosine score / fused score / vector header."""
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
# Module-level hybrid retrieval (division 1, option 3): keyword ranks + README semantic ranks -> RRF fusion
# ---------------------------------------------------------------------------
def build_module_cards(cur, rows):
    """Enrich (mid, name, family, readme, aliases) rows with file/class/function counts and examples, returning a list of cards."""
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
    """Module-level hybrid retrieval: keyword ranks + README semantic ranks, fused with RRF (k=60).

    Pipeline (matching the flow shown in the frontend):
      1) query tokenization -> 2) keyword ranks (hits in name/family/readme/aliases) and
         3) semantic ranks (query vector vs each module's readme_embedding cosine) - two lists
      4) RRF fusion: score = sum of 1/(k+rank); uses ranks only, no score normalization, no tuned weights.
    Return module cards sorted by descending RRF, each with its score and why (match reason).
    """
    ensure_compatible()
    q = (req.query or "").strip().lower()
    q_pp = preprocess_query(req.query)  # spelling correction + nickname expansion + SYNONYMS expansion; used in 3.2, aligned here for 3.1
    # Algorithms outside the repo: the not-in-repo notice takes priority over normal retrieval (avoid misleading semantic substitutes)
    not_in = detect_not_in_repo(req.query)
    if not_in:
        return {
            "query": req.query,
            "not_in_repo": True,
            "algorithm": not_in,
            "message": f"This algorithm is not in this repository (numpy-ml): {not_in}.",
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

    # 2) Keyword ranks: English tokens + whole-phrase alias containment matching (with light singular/plural normalization)
    q_tokens = [t for t in re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", q_pp)
                if t not in parser.PY_STOP and t not in EN_STOP and len(t) > 1]

    def _kw_hit(tok, hay):
        if tok in hay:
            return True
        # Light stemming: scale->scaling, normalize->normalization, topic->topics,
        # cluster->clustering, regress->regression and other derivatives (longest common prefix >= 4 and length difference <= 4)
        # The length gap is relaxed to 4 to cover derivatives like normalize(9)->normalization(13).
        # na_text/rd_text are JSON strings; words may carry quotes/punctuation, strip them before comparing
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
        # Name/alias hit = strong signal (the module is named this); README hit = weak signal (common words in long text easily misfire)
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
            # Name/alias hits weighted x2, README hits x1; whole-phrase alias hits are a strong signal and get extra weight,
            # preventing a specific algorithm from being pushed out by a shared-keyword module (e.g. naive bayes displaced by gaussian's gmm).
            bonus = 5.0 if ma else 0.0
            kw_scores[mid] = (2 * na_hits + rd_hits + bonus) / (2 * len(q_tokens))
        else:
            kw_scores[mid] = 1.0 if (na_hits or ma) else 0.0
    kw_ranked = sorted([m for m in kw_scores if kw_scores[m] > 0],
                       key=lambda m: kw_scores[m], reverse=True)
    kw_rank = {m: i + 1 for i, m in enumerate(kw_ranked)}

    # 3) Semantic ranks: query vector vs each module's README vector cosine
    qvec = embed_query(q_pp)
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

    # 4) RRF fusion (k=60, Cormack et al. 2009)
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
    # Whole-phrase alias hit: decisive weighting that overrides semantic/keyword noise (e.g. naive bayes should not be displaced by gaussian's gmm).
    # A single RRF channel maxes out around 1/(60+1) ~= 0.016, so a 0.2 bonus is enough to keep the alias-matched module firmly first.
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
