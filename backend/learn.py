"""学习板块（Learn Module）后端：数学原理卡片、算法对比、学习路径、调用关系图。

这是学习板块功能开发（分工 2）的主战场。

数据存放在 data/learn_content.json（仓库已带一份空模板）。可直接往该 JSON 填内容，
或改写下面的函数接数据库 / 调 retrieval 也行。前端通过 /api/learn/* 拿数据，不用动 retrieval.py。
"""
import json
import os
import re

from backend import db

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEARN_PATH = os.path.join(REPO_ROOT, "data", "learn_content.json")

_EMPTY = {"modules": {}}


def load_learn():
    try:
        with open(LEARN_PATH, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return _EMPTY


def _module(name):
    data = load_learn()
    return data.get("modules", {}).get(name, {})


def list_modules():
    """返回所有已配置学习模块的概览列表。"""
    data = load_learn()
    out = []
    for name, m in data.get("modules", {}).items():
        out.append({
            "module": name,
            "family": m.get("family", ""),
            "cards": len(m.get("cards", []) or []),
            "has_compare": bool(m.get("compare")),
            "has_path": bool(m.get("path")),
            "has_call_graph": bool(m.get("call_graph")),
        })
    return {"modules": out}


def get_card(module, algorithm=None):
    """返回某模块的数学原理卡片；指定 algorithm 则只返回该算法的卡片。"""
    m = _module(module)
    cards = m.get("cards", []) or []
    if algorithm:
        cards = [c for c in cards if c.get("algorithm") == algorithm]
    return {"module": module, "cards": cards}


def compare(module):
    """返回某模块的算法对比表。"""
    m = _module(module)
    return {"module": module, "compare": m.get("compare", []) or []}


def learning_path(module=None, algorithm=None):
    """按选中的算法自动生成分步学习路径。

    路径完全由索引库里的元数据推导：算法自身的数学方法、它所属的模块、
    同模块的兄弟算法、以及源码规模与参数签名。因此换一个算法，
    每一步的标题与内容都会随之变化，不需要人工预先为每个算法写死一条路径。
    """
    conn = db.get_conn()
    cur = conn.cursor()
    try:
        target = _fetch_target(cur, module, algorithm)
        if not target:
            return {"module": module or "", "algorithm": algorithm or "", "steps": [],
                    "note": "The selected algorithm was not found in the index. / 未在索引中找到该算法。"}

        mod = target["module"] or target["path"]
        cur.execute("SELECT family, description, readme FROM modules WHERE name=%s", (mod,))
        mrow = cur.fetchone()
        mod_family = (mrow[0] if mrow else "") or target["family"]
        mod_desc = _first_sentence((mrow[1] if mrow else "") or (mrow[2] if mrow else ""))

        cur.execute(
            "SELECT a.name, a.start_line, a.end_line, a.math_methods, a.complexity, f.path "
            "FROM algorithms a JOIN code_files f ON a.file_id=f.id "
            "WHERE a.module=%s AND a.name<>%s ORDER BY a.name",
            (mod, target["name"]))
        siblings = [{
            "name": r[0], "lines": f"{r[1]}-{r[2]}",
            "math_methods": _json_list(r[3])[:3], "complexity": r[4], "path": r[5],
        } for r in cur.fetchall()]

        cur.execute("SELECT COUNT(*) FROM algorithms WHERE module=%s", (mod,))
        mod_size = cur.fetchone()[0]
    finally:
        conn.close()

    methods = target["math_methods"]
    params = _merge_params(target["params"], _signature_params(target["code_text"]))

    steps = [
        {
            "step": 1, "kind": "prerequisite",
            "title": "数学前置 / Mathematical prerequisites",
            "detail": (f"该算法在索引里标注了 {len(methods)} 个数学方法，先补齐它们所属的基础学科："
                       if methods else
                       "该算法没有标注数学方法，先复习下面几个通用基础更稳妥："),
            "items": _foundation_groups(methods),
        },
        {
            "step": 2, "kind": "module",
            "title": f"模块定位 / Where it sits: {mod}",
            "detail": (f"{target['name']} 属于 {mod} 模块，算法族为 {mod_family or '—'}，"
                       f"任务类型为 {target['task'] or '—'}。该模块共 {mod_size} 个算法类。"
                       + (f" {mod_desc}" if mod_desc else "")),
            "items": [{
                "name": "源码位置",
                "note": f"{target['path']}:{target['start_line']}-{target['end_line']}",
            }],
        },
        {
            "step": 3, "kind": "module_survey",
            "title": "同模块横向对照 / Compare with siblings",
            "detail": (f"{mod} 模块里还有 {len(siblings)} 个同类算法。"
                       "先横向扫一遍，理解这一族方法共同解决什么问题，再回到目标算法看它做了什么取舍。"
                       if siblings else
                       f"{mod} 模块里没有其他算法类，可以直接进入目标算法精读。"),
            "items": [{
                "name": s["name"],
                "note": f"{s['path']}:{s['lines']}" + (
                    " · " + ", ".join(str(m) for m in s["math_methods"]) if s["math_methods"] else ""),
            } for s in siblings[:8]],
        },
        {
            "step": 4, "kind": "target",
            "title": f"目标算法精读 / {target['name']}",
            "detail": (f"回到源码 {target['path']}:{target['start_line']}-{target['end_line']}，"
                       f"该片段共 {target['code_lines']} 行。"),
            "items": [
                {"name": "关键参数", "note": ", ".join(str(p) for p in params[:8]) or "—"},
                {"name": "数学方法", "note": ", ".join(str(m) for m in methods[:8]) or "—"},
            ] + ([{"name": "开销参考值", "note": str(target["complexity"])}] if target.get("complexity") is not None else []),
        },
    ]

    roadmap = [{
        "name": target["name"],
        "path": target["path"],
        "lines": f"{target['start_line']}-{target['end_line']}",
        "math_methods": methods[:3],
        "complexity": target.get("complexity"),
        "is_target": True,
    }] + [{
        "name": s["name"],
        "path": s["path"],
        "lines": s["lines"],
        "math_methods": s["math_methods"],
        "complexity": s["complexity"],
        "is_target": False,
    } for s in siblings]

    return {
        "module": mod,
        "algorithm": target["name"],
        "steps": steps,
        "source": {"path": target["path"], "lines": f"{target['start_line']}-{target['end_line']}"},
        "module_size": mod_size,
        "roadmap": sorted(roadmap, key=lambda r: r["name"]),   # 模块内全部算法，供前端画路线图与统计进度
        "note": ("Path is generated from indexed metadata (math methods, module membership, "
                 "sibling algorithms, source size). It is a reading order, not a verified dependency proof. / "
                 "路径由索引元数据自动生成，是阅读顺序建议，不是源码依赖关系的证明。"),
    }


# 数学方法关键词 → 基础学科。用于把算法自带的 math_methods 归到「该先补什么」。
_FOUNDATIONS = [
    ("线性代数 / Linear algebra",
     ("vector", "matrix", "matrices", "linear", "orthogonal", "eigen", "svd",
      "decomposition", "projection", "norm", "inner product", "dot product", "transpose")),
    ("概率与统计 / Probability & statistics",
     ("probability", "distribution", "gaussian", "normal", "bayes", "bayesian",
      "posterior", "prior", "likelihood", "bernoulli", "multinomial", "dirichlet",
      "beta", "gamma", "poisson", "categorical", "latent")),
    ("微积分与梯度 / Calculus & gradients",
     ("gradient", "derivative", "jacobian", "hessian", "backpropagation", "chain rule",
      "differential", "gradient descent")),
    ("数值优化 / Numerical optimization",
     ("optimization", "descent", "newton", "conjugate", "momentum", "learning rate",
      "convergence", "coordinate ascent", "em algorithm")),
    ("信息论 / Information theory",
     ("entropy", "information", "kl-divergence", "cross-entropy", "mutual information")),
    ("采样与近似推断 / Sampling & approximate inference",
     ("sampling", "monte carlo", "gibbs", "mcmc", "metropolis", "variational",
      "mean-field", "approximation")),
]

_ALGO_COLS = ("name", "module", "family", "task", "math_methods", "params",
              "docstring_math", "complexity", "start_line", "end_line",
              "code_text", "path")


def _algo_dict(row):
    d = dict(zip(_ALGO_COLS, row))
    d["math_methods"] = _json_list(d.get("math_methods"))
    d["params"] = _json_list(d.get("params"))
    d["code_lines"] = len((d.get("code_text") or "").splitlines())
    return d


def _fetch_target(cur, module=None, algorithm=None):
    """定位目标实体：先按算法类名，再按成员函数名。

    指定了算法名却没命中时直接返回 None，不再回退到「模块里的第一个算法」——
    否则会出现用户点 A、路径却是 B 的情况。
    """
    cols = "a." + ", a.".join(_ALGO_COLS[:-1]) + ", f.path"
    if algorithm:
        tail = str(algorithm).split(".")[-1]
        for table in ("algorithms", "functions"):
            cur.execute(
                f"SELECT {cols} FROM {table} a JOIN code_files f ON a.file_id=f.id "
                "WHERE a.name=%s OR a.name=%s ORDER BY a.name LIMIT 1",
                (algorithm, tail))
            row = cur.fetchone()
            if row:
                return _algo_dict(row)
        return None
    if module:
        cur.execute(
            f"SELECT {cols} FROM algorithms a JOIN code_files f ON a.file_id=f.id "
            "WHERE a.module=%s ORDER BY a.name LIMIT 1", (module,))
        row = cur.fetchone()
        if row:
            return _algo_dict(row)
    return None


def _foundation_groups(methods):
    """把数学方法归入基础学科，按命中情况返回条目。"""
    low = [str(m).lower() for m in methods]
    hits = []
    for title, keys in _FOUNDATIONS:
        matched = sorted({str(m) for m, l in zip(methods, low) if any(k in l for k in keys)})
        if matched:
            hits.append({"name": title, "note": ", ".join(matched[:5])})
    if not hits:
        hits = [{"name": title, "note": "通用基础"} for title, _ in _FOUNDATIONS[:3]]
    return hits[:4]


def _merge_params(stored, from_code):
    """合并元数据参数与签名解析参数。元数据里的值可能是逗号串，先拆开再去重保序。"""
    out = []
    for value in list(stored or []) + list(from_code or []):
        for piece in str(value).split(","):
            text = piece.strip()
            if text and text not in out:
                out.append(text)
    return out


def _signature_params(code):
    """从源码签名解析参数名：优先 __init__，其次任意 def。"""
    lines = (code or "").splitlines()
    for want_init in (True, False):
        for line in lines:
            m = re.match(r"\s*def\s+(\w+)\s*\(([^)]*)\)", line)
            if not m:
                continue
            if want_init and m.group(1) != "__init__":
                continue
            out = []
            for part in m.group(2).split(","):
                name = part.strip().split("=")[0].strip().lstrip("*")
                if name and name not in ("self", "cls") and name not in out:
                    out.append(name)
            if out:
                return out
    return []


def _first_sentence(text):
    """取一段说明的开头，顺便剥掉 markdown 标记。"""
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text or "")
    text = re.sub(r"[#*`>_|]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return ""
    m = re.search(r"[.!?。！？]", text)
    return text[:m.end()] if m and m.end() <= 160 else text[:120]


def _json_list(value):
    """Normalize MySQL JSON/TEXT values to a list."""
    if value in (None, ""):
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        return [value]
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else [parsed]
        except Exception:
            return [value]
    return [value]


def _graph_rows():
    """Load graph-relevant entities from the indexed repository."""
    conn = db.get_conn()
    cur = conn.cursor()
    rows = []
    cur.execute("""
        SELECT a.id,a.name,'class',NULL,a.module,a.family,a.task,a.call_edges,
               a.ref_edges,a.start_line,a.end_line,f.path
        FROM algorithms a JOIN code_files f ON a.file_id=f.id
    """)
    rows.extend(cur.fetchall())
    cur.execute("""
        SELECT fn.id,fn.name,'function',fn.parent_class,fn.module,fn.family,fn.task,
               fn.call_edges,fn.ref_edges,fn.start_line,fn.end_line,f.path
        FROM functions fn JOIN code_files f ON fn.file_id=f.id
    """)
    rows.extend(cur.fetchall())
    conn.close()
    return [{
        "id": r[0], "entity": r[1] or "", "type": r[2], "parent_class": r[3],
        "module": r[4] or "", "family": r[5] or "", "task": r[6] or "",
        "call_edges": _json_list(r[7]), "ref_edges": r[8],
        "start_line": r[9], "end_line": r[10], "path": r[11] or "",
    } for r in rows]


def _call_tokens(row):
    out = set()
    for raw in row.get("call_edges", []):
        if isinstance(raw, dict):
            raw = raw.get("name") or raw.get("target") or ""
        text = str(raw).strip()
        if not text:
            continue
        out.add(text)
        out.add(text.split(".")[-1])
    return out


def call_graph(module="", entity="", path=""):
    """Build a live call graph from parser-produced call_edges stored in MySQL.

    The graph is intentionally conservative: a call symbol is linked only when it can
    be matched to an indexed class/function/method name. Unresolved external/library
    calls are returned separately instead of being presented as verified edges.
    """
    rows = _graph_rows()
    if not rows:
        return {"module": module, "entity": entity, "nodes": [], "edges": [],
                "unresolved_calls": [], "message": "No indexed code entities."}

    def score_root(r):
        score = 0
        if entity and r["entity"] == entity:
            score += 100
        if entity and r["entity"].split(".")[-1] == entity.split(".")[-1]:
            score += 30
        if path and r["path"] == path:
            score += 20
        if module and r["module"] == module:
            score += 5
        return score

    candidates = sorted(rows, key=score_root, reverse=True)
    root = candidates[0]
    if score_root(root) == 0:
        return {"module": module, "entity": entity, "nodes": [], "edges": [],
                "unresolved_calls": [], "message": "Selected entity was not found in the index."}

    # Index both full entity names (Class.method) and their terminal symbol (method).
    by_symbol = {}
    for r in rows:
        for key in {r["entity"], r["entity"].split(".")[-1]}:
            if key:
                by_symbol.setdefault(key, []).append(r)

    def choose_target(symbol, source):
        options = by_symbol.get(symbol, []) or by_symbol.get(symbol.split(".")[-1], [])
        if not options:
            return None
        # Prefer same file, then same module. This reduces false cross-module links.
        return sorted(options, key=lambda r: (
            r["path"] != source["path"], r["module"] != source["module"], r["entity"]
        ))[0]

    node_map = {}
    edges = []
    unresolved = []

    def key(r):
        return f'{r["type"]}:{r["id"]}'

    def add_node(r, role="related"):
        k = key(r)
        node_map[k] = {
            "id": k, "entity": r["entity"], "type": r["type"],
            "parent_class": r["parent_class"], "module": r["module"],
            "family": r["family"], "task": r["task"], "path": r["path"],
            "lines": f'{r["start_line"]}-{r["end_line"]}', "role": role,
        }
        return k

    root_id = add_node(root, "selected")

    # Outgoing calls from the selected entity.
    for raw in root.get("call_edges", []):
        symbol = str(raw.get("name") or raw.get("target") or "") if isinstance(raw, dict) else str(raw)
        symbol = symbol.strip()
        target = choose_target(symbol, root)
        if target and key(target) != root_id:
            tid = add_node(target, "callee")
            edge = {"source": root_id, "target": tid, "kind": "calls", "symbol": symbol}
            if edge not in edges:
                edges.append(edge)
        elif symbol:
            unresolved.append(symbol)

    # Incoming calls: indexed entities whose call symbols resolve to the selected name.
    root_names = {root["entity"], root["entity"].split(".")[-1]}
    for caller in rows:
        if key(caller) == root_id:
            continue
        if _call_tokens(caller) & root_names:
            cid = add_node(caller, "caller")
            edge = {"source": cid, "target": root_id, "kind": "calls", "symbol": root["entity"]}
            if edge not in edges:
                edges.append(edge)

    # Keep the UI readable for highly connected utility functions.
    max_nodes = 31
    if len(node_map) > max_nodes:
        keep = set(list(node_map.keys())[:max_nodes])
        keep.add(root_id)
        node_map = {k: v for k, v in node_map.items() if k in keep}
        edges = [e for e in edges if e["source"] in keep and e["target"] in keep]

    return {
        "module": root["module"], "entity": root["entity"], "root_id": root_id,
        "nodes": list(node_map.values()), "edges": edges,
        "unresolved_calls": sorted(set(unresolved))[:30],
        "note": "Edges come from AST call symbols stored during indexing; ambiguous symbols are resolved by same-file/same-module preference.",
    }
