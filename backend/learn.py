"""学习板块（Learn Module）后端：数学原理卡片、算法对比、学习路径、调用关系图。

这是学习板块功能开发（分工 2）的主战场。

数据存放在 data/learn_content.json（仓库已带一份空模板）。可直接往该 JSON 填内容，
或改写下面的函数接数据库 / 调 retrieval 也行。前端通过 /api/learn/* 拿数据，不用动 retrieval.py。
"""
import json
import os

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


def learning_path(module=None):
    """返回学习路径（可整体或按模块）。"""
    data = load_learn()
    if module:
        return {"module": module, "path": _module(module).get("path", []) or []}
    # 整体路径：按各模块 path 顺序拼接
    full = []
    for name, m in data.get("modules", {}).items():
        for step in (m.get("path", []) or []):
            full.append({"module": name, **step} if isinstance(step, dict) else {"module": name, "step": step})
    return {"path": full}


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
