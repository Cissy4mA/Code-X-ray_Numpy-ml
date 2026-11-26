"""Backend for the Learn Module: math principle cards, algorithm comparisons, learning paths, and call graphs.

This is the main area for learning module development (task 2).

Data lives in data/learn_content.json (the repo ships an empty template). You can fill that JSON directly,
or rewrite the functions below to connect to the database / call retrieval. The frontend gets data via
/api/learn/*, so retrieval.py does not need to change.
"""
import ast
import json
import os
import re
import textwrap

from backend import db
from backend.quiz import generate_quiz

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
    """Return an overview list of all configured learning modules."""
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
    """Return math principle cards for a module; if algorithm is specified, return only that algorithm's cards."""
    m = _module(module)
    cards = m.get("cards", []) or []
    if algorithm:
        cards = [c for c in cards if c.get("algorithm") == algorithm]
    return {"module": module, "cards": cards, "source": "curated"}


def compare(module):
    """Return the algorithm comparison table for a module."""
    m = _module(module)
    conn = db.get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT a.name, f.path FROM algorithms a JOIN code_files f ON a.file_id=f.id "
            "WHERE a.module=%s ORDER BY a.name, f.path",
            (module,))
        identities = cur.fetchall()
        algorithms = []
        for name, path in identities:
            target = _fetch_target(cur, module, name, path)
            if target:
                detail = _algorithm_detail(cur, target, include_functions=False)
                detail.pop("code", None)
                algorithms.append(detail)
        return {"module": module, "compare": m.get("compare", []) or [],
                "algorithms": algorithms}
    finally:
        conn.close()


def get_algorithm(module, algorithm, path=""):
    conn = db.get_conn()
    try:
        cur = conn.cursor()
        target = _fetch_target(cur, module, algorithm, path)
        return {"algorithm": _algorithm_detail(cur, target) if target else None}
    finally:
        conn.close()


def _algorithm_detail(cur, target, include_functions=True):
    functions = []
    if include_functions:
        cur.execute(
            "SELECT fn.name, fn.docstring_math, fn.code_text "
            "FROM functions fn JOIN code_files f ON fn.file_id=f.id "
            "WHERE fn.module=%s AND fn.parent_class=%s AND f.path=%s ORDER BY fn.start_line",
            (target["module"], target["name"], target["path"]))
        functions = [{"name": row[0], "meaning": row[1] or "", "code": row[2] or ""}
                     for row in cur.fetchall()]
    detail = {
        "entity": target["name"], "module": target["module"],
        "family": target["family"] or "", "task": target["task"] or "",
        "math_methods": target["math_methods"],
        "params": _merge_params(target["params"], _signature_params(target["code_text"])),
        "docstring_math": target["docstring_math"] or "", "complexity": target["complexity"],
        "references": _json_list(target.get("references")),
        "source_signals": _source_signals(target["code_text"]),
        "path": target["path"], "lines": f'{target["start_line"]}-{target["end_line"]}',
        "code": target["code_text"] or "", "functions": functions,
    }
    if include_functions:
        detail["quiz"] = generate_quiz(detail)
    return detail


def _source_signals(code):
    try:
        tree = ast.parse(textwrap.dedent(code or ""))
    except (SyntaxError, ValueError):
        return None
    nodes = list(ast.walk(tree))
    return {
        "lines": len((code or "").splitlines()),
        "for_loops": sum(isinstance(node, (ast.For, ast.AsyncFor)) for node in nodes),
        "while_loops": sum(isinstance(node, ast.While) for node in nodes),
        "comprehensions": sum(isinstance(node, ast.comprehension) for node in nodes),
        "branches": sum(isinstance(node, (ast.If, ast.IfExp)) for node in nodes),
        "matrix_operators": sum(isinstance(node, ast.MatMult) for node in nodes),
    }


def learning_path(module=None, algorithm=None, path=""):
    """Automatically generate a step-by-step learning path for the selected algorithm.

    The path is derived entirely from metadata in the index: the algorithm's own math methods,
    its module, sibling algorithms in the same module, source size, and parameter signature.
    Therefore switching algorithms changes the title and content of every step; no path needs
    to be hand-written in advance for each algorithm.
    """
    conn = db.get_conn()
    cur = conn.cursor()
    try:
        target = _fetch_target(cur, module, algorithm, path)
        if not target:
            return {"module": module or "", "algorithm": algorithm or "", "steps": [],
                    "note": "The selected algorithm was not found in the index."}

        mod = target["module"] or target["path"]
        cur.execute("SELECT family, description, readme FROM modules WHERE name=%s", (mod,))
        mrow = cur.fetchone()
        mod_family = (mrow[0] if mrow else "") or target["family"]
        mod_desc = _first_sentence((mrow[1] if mrow else "") or (mrow[2] if mrow else ""))

        cur.execute(
            "SELECT a.name, a.start_line, a.end_line, a.math_methods, a.complexity, f.path "
            "FROM algorithms a JOIN code_files f ON a.file_id=f.id "
            "WHERE a.module=%s AND (a.name<>%s OR f.path<>%s) ORDER BY a.name, f.path",
            (mod, target["name"], target["path"]))
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
            "title": "Mathematical prerequisites",
            "detail": (f"The index tagged this algorithm with {len(methods)} math methods; first review the foundational subjects they belong to:"
                       if methods else
                       "No math methods were tagged for this algorithm; it is safer to review the general foundations below first:"),
            "items": _foundation_groups(methods),
        },
        {
            "step": 2, "kind": "module",
            "title": f"Where it sits: {mod}",
            "detail": (f"{target['name']} belongs to the {mod} module, with algorithm family {mod_family or '—'} "
                       f"and task type {target['task'] or '—'}. The module has {mod_size} algorithm classes in total."
                       + (f" {mod_desc}" if mod_desc else "")),
            "items": [{
                "name": "Source location",
                "note": f"{target['path']}:{target['start_line']}-{target['end_line']}",
            }],
        },
        {
            "step": 3, "kind": "module_survey",
            "title": "Compare with siblings",
            "detail": (f"There are {len(siblings)} other algorithms in the {mod} module. "
                       "Scan them first to see what problem this family of methods solves, then return to the "
                       "target algorithm to see the trade-offs it makes."
                       if siblings else
                       f"There are no other algorithm classes in the {mod} module; you can go straight to a close reading of the target algorithm."),
            "items": [{
                "name": s["name"],
                "note": f"{s['path']}:{s['lines']}" + (
                    " · " + ", ".join(str(m) for m in s["math_methods"]) if s["math_methods"] else ""),
            } for s in siblings[:8]],
        },
        {
            "step": 4, "kind": "target",
            "title": f"Close reading: {target['name']}",
            "detail": (f"Go back to the source code at {target['path']}:{target['start_line']}-{target['end_line']}; "
                       f"this excerpt has {target['code_lines']} lines."),
            "items": [
                {"name": "Key parameters", "note": ", ".join(str(p) for p in params[:8]) or "—"},
                {"name": "Math methods", "note": ", ".join(str(m) for m in methods[:8]) or "—"},
            ] + ([{"name": "Source complexity heuristic (not Big-O)", "note": str(target["complexity"])}] if target.get("complexity") is not None else []),
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
        "roadmap": sorted(roadmap, key=lambda r: r["name"]),
        "note": ("Path is generated from indexed metadata (math methods, module membership, "
                 "sibling algorithms, source size). It is a reading order, not a verified dependency proof."),
    }


_FOUNDATIONS = [
    ("Linear algebra",
     ("vector", "matrix", "matrices", "linear", "orthogonal", "eigen", "svd",
      "decomposition", "projection", "norm", "inner product", "dot product", "transpose")),
    ("Probability & statistics",
     ("probability", "distribution", "gaussian", "normal", "bayes", "bayesian",
      "posterior", "prior", "likelihood", "bernoulli", "multinomial", "dirichlet",
      "beta", "gamma", "poisson", "categorical", "latent")),
    ("Calculus & gradients",
     ("gradient", "derivative", "jacobian", "hessian", "backpropagation", "chain rule",
      "differential", "gradient descent")),
    ("Numerical optimization",
     ("optimization", "descent", "newton", "conjugate", "momentum", "learning rate",
      "convergence", "coordinate ascent", "em algorithm")),
    ("Information theory",
     ("entropy", "information", "kl-divergence", "cross-entropy", "mutual information")),
    ("Sampling & approximate inference",
     ("sampling", "monte carlo", "gibbs", "mcmc", "metropolis", "variational",
      "mean-field", "approximation")),
]

_ALGO_COLS = ("name", "module", "family", "task", "math_methods", "params",
              "docstring_math", "complexity", "start_line", "end_line",
              "code_text", "references", "path")


def _algo_dict(row):
    d = dict(zip(_ALGO_COLS, row))
    d["math_methods"] = _json_list(d.get("math_methods"))
    d["params"] = _json_list(d.get("params"))
    d["code_lines"] = len((d.get("code_text") or "").splitlines())
    return d


def _fetch_target(cur, module=None, algorithm=None, path=""):
    """Locate the target entity: first by algorithm class name, then by member function name.

    If an algorithm name is given but no match is found, return None instead of falling back to
    "the first algorithm in the module" - otherwise the user could click A while the path shows B.
    """
    cols = ", ".join(f"a.`{column}`" for column in _ALGO_COLS[:-1]) + ", f.path"
    if algorithm:
        tail = str(algorithm).split(".")[-1]
        for table in ("algorithms", "functions"):
            filters = ["(a.name=%s OR a.name=%s)"]
            values = [algorithm, tail]
            if module:
                filters.append("a.module=%s")
                values.append(module)
            if path:
                filters.append("f.path=%s")
                values.append(path)
            cur.execute(
                f"SELECT {cols} FROM {table} a JOIN code_files f ON a.file_id=f.id "
                "WHERE " + " AND ".join(filters) + " ORDER BY a.name LIMIT 1",
                tuple(values))
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
    """Group math methods into foundational subjects and return entries for the matches."""
    low = [str(m).lower() for m in methods]
    hits = []
    for title, keys in _FOUNDATIONS:
        matched = sorted({str(m) for m, l in zip(methods, low) if any(k in l for k in keys)})
        if matched:
            hits.append({"name": title, "note": ", ".join(matched[:5])})
    if not hits:
        hits = [{"name": title, "note": "General foundations"} for title, _ in _FOUNDATIONS[:3]]
    return hits[:4]


def _merge_params(stored, from_code):
    """Merge metadata parameters with signature-parsed parameters. Metadata values may be comma-separated strings; split them first, then deduplicate while preserving order."""
    out = []
    for value in list(stored or []) + list(from_code or []):
        for piece in str(value).split(","):
            text = piece.strip()
            if text and text not in out:
                out.append(text)
    return out


def _signature_params(code):
    """Read the selected class constructor or selected function's signature."""
    try:
        tree = ast.parse(textwrap.dedent(code or ""))
    except (SyntaxError, ValueError):
        return []
    definitions = [node for node in tree.body
                   if isinstance(node, (ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef))]
    if not definitions:
        return []
    target = definitions[0]
    if isinstance(target, ast.ClassDef):
        target = next((node for node in target.body
                       if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
                       and node.name == "__init__"), None)
    if target is None:
        return []
    arguments = list(target.args.posonlyargs) + list(target.args.args) + list(target.args.kwonlyargs)
    arguments += [argument for argument in (target.args.vararg, target.args.kwarg) if argument]
    return [argument.arg for argument in arguments if argument.arg not in ("self", "cls")]


def _first_sentence(text):
    """Take the beginning of a description, stripping markdown markup along the way."""
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text or "")
    text = re.sub(r"[#*`>_|]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return ""
    m = re.search(r"[.!?]", text)
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

    candidates = [row for row in rows
                  if (not module or row["module"] == module)
                  and (not path or row["path"] == path)
                  and (not entity or row["entity"] == entity)]
    candidates = sorted(candidates, key=score_root, reverse=True)
    if not candidates:
        return {"module": module, "entity": entity, "nodes": [], "edges": [],
                "unresolved_calls": [], "message": "Selected entity was not found in the index."}
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
        def priority(row):
            return (row["path"] != source["path"], row["module"] != source["module"],
                    row["parent_class"] != source["parent_class"])
        options = sorted(options, key=priority)
        if len(options) > 1 and priority(options[0]) == priority(options[1]):
            return None
        return options[0]

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
        matches = _call_tokens(caller) & root_names
        if matches and any(choose_target(symbol, caller) == root for symbol in matches):
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
