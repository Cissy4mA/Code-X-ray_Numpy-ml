"""学习板块（Learn Module）后端：数学卡片、算法对比、学习路径、相似推荐、调用关系图。

分工 2-2（学习板块功能开发）主战场。

数据采用「自动装配 + 人工补充」两层设计：
1. 自动层（主来源）：直接查 MySQL algorithms / functions 表，把入库时抽取的
   math_methods / params / references / docstring_math / call_edges / embedding_json
   等元数据装配成卡片、对比表、路径、图。零人工维护，覆盖全部算法类。
2. 人工层（补充）：data/learn_content.json，只放机器生成不了的内容
   （直觉解释、优缺点、使用建议等）。两层按算法名合并，人工字段优先。

前端通过 /api/learn/* 拿数据，不碰 retrieval.py。
"""
import json
import os

from backend import db, parser

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEARN_PATH = os.path.join(REPO_ROOT, "data", "learn_content.json")

_EMPTY = {"modules": {}}

_ALGO_COLS = (
    "c.id, c.name, c.module, c.family, c.task, c.math_methods, c.params, "
    "c.`references`, c.docstring_math, c.complexity, c.ref_edges, c.call_edges, "
    "c.start_line, c.end_line, f.path"
)


# ---------------------------------------------------------------------------
# 工具函数
# ---------------------------------------------------------------------------
def load_learn():
    """读取人工补充层 JSON；文件缺失 / 损坏时返回空结构。"""
    try:
        with open(LEARN_PATH, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return _EMPTY


def _module_notes(name):
    return load_learn().get("modules", {}).get(name, {})


def _jload(raw, default):
    try:
        return json.loads(raw) if raw else default
    except Exception:
        return default


def _fetch_algos(cur, module, algorithm=None, with_path=True):
    """按模块（可选算法名）取 algorithms 行，返回 dict 列表。"""
    sql = f"SELECT {_ALGO_COLS} FROM algorithms c JOIN code_files f ON f.id = c.file_id "
    sql += "WHERE c.module = %s"
    args = [module]
    if algorithm:
        sql += " AND c.name = %s"
        args.append(algorithm)
    sql += " ORDER BY c.name"
    cur.execute(sql, args)
    rows = cur.fetchall()
    out = []
    for r in rows:
        (cid, name, mod, family, task, mm, pa, ref, dmath,
         cpx, redges, cedges, s, e, path) = r
        out.append({
            "id": cid, "name": name, "module": mod, "family": family, "task": task,
            "math_methods": _jload(mm, []), "params": _jload(pa, []),
            "references": _jload(ref, []),
            "docstring_math": dmath or "", "complexity": cpx or 0.0,
            "ref_edges": _jload(redges, {"bases": [], "imports": []}),
            "call_edges": _jload(cedges, []),
            "start_line": s, "end_line": e, "path": path or "",
        })
    return out


def _merge_manual(cards, module, manual_key="cards"):
    """把人工层里同名字段的补充内容合并进自动卡片（人工字段优先）。"""
    manual = {c.get("algorithm"): c for c in (_module_notes(module).get(manual_key) or [])
              if isinstance(c, dict) and c.get("algorithm")}
    for card in cards:
        extra = manual.get(card.get("name") or card.get("algorithm"))
        if extra:
            for k, v in extra.items():
                if k not in ("algorithm",):
                    card[k] = v
    return cards


# ---------------------------------------------------------------------------
# 对外接口（app.py 路由）
# ---------------------------------------------------------------------------
def list_modules():
    """返回所有学习模块概览：数据库真实模块 + 是否有人工补充内容。"""
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("SELECT name, family FROM modules ORDER BY name")
    mods = cur.fetchall()
    conn.close()
    notes = load_learn().get("modules", {})
    out = []
    for name, family in mods:
        m = notes.get(name, {})
        out.append({
            "module": name,
            "family": family or "",
            "has_notes": bool(m),
            "notes_cards": len(m.get("cards", []) or []),
            "has_compare": bool(m.get("compare")),
            "has_path": bool(m.get("path")),
            "has_call_graph": bool(m.get("call_graph")),
        })
    return {"modules": out}


def get_card(module, algorithm=None):
    """某模块的数学原理卡片（自动装配）；指定 algorithm 则只返回该算法。"""
    if not module:
        return {"module": "", "cards": [], "hint": "module query param required / 需要 module 参数"}
    conn = db.get_conn()
    cur = conn.cursor()
    rows = _fetch_algos(cur, module, algorithm)
    conn.close()
    cards = [{
        "algorithm": r["name"], "module": r["module"], "family": r["family"],
        "task": r["task"], "math_methods": r["math_methods"], "params": r["params"],
        "references": r["references"], "docstring_math": r["docstring_math"],
        "complexity": round(r["complexity"], 2), "path": r["path"],
        "lines": f"{r['start_line']}-{r['end_line']}",
    } for r in rows]
    cards = _merge_manual(cards, module)
    return {"module": module, "cards": cards}


def compare(module):
    """某模块的算法对比表（自动装配 + 人工 pros/cons 合并）。"""
    if not module:
        return {"module": "", "compare": [], "hint": "module query param required / 需要 module 参数"}
    conn = db.get_conn()
    cur = conn.cursor()
    rows = _fetch_algos(cur, module)
    conn.close()
    table = [{
        "algorithm": r["name"], "family": r["family"], "task": r["task"],
        "math_methods": r["math_methods"], "params": r["params"],
        "docstring_math": (r["docstring_math"] or "")[:300],
        "complexity": round(r["complexity"], 2),
    } for r in rows]
    manual = {c.get("algorithm"): c for c in (_module_notes(module).get("compare") or [])
              if isinstance(c, dict) and c.get("algorithm")}
    for row in table:
        extra = manual.get(row["algorithm"])
        if extra:
            for k in ("pros", "cons", "use_when"):
                if k in extra:
                    row[k] = extra[k]
    return {"module": module, "compare": table}


def learning_path(module=None, algorithm=None):
    """学习路径：自动生成「前置 → 算法族 → 模块综述 → 目标算法」四步。"""
    if not module:
        # 无模块时返回全局路径：每个模块一步
        conn = db.get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT m.name, m.family, COUNT(a.id) FROM modules m "
            "LEFT JOIN algorithms a ON a.module = m.name GROUP BY m.name, m.family "
            "ORDER BY m.name")
        rows = cur.fetchall()
        conn.close()
        return {"path": [{
            "step": i + 1, "module": name, "title": f"{name} 模块",
            "detail": f"family: {family or '—'} · {n} 个算法类",
        } for i, (name, family, n) in enumerate(rows)]}

    conn = db.get_conn()
    cur = conn.cursor()
    rows = _fetch_algos(cur, module, algorithm)
    conn.close()
    if not rows:
        return {"module": module, "algorithm": algorithm, "path": []}
    target = rows[0]
    siblings = [r for r in rows if r["id"] != target["id"]]
    notes = _module_notes(module).get("cards") or []
    note_map = {c.get("algorithm"): c for c in notes if isinstance(c, dict)}
    tnote = note_map.get(target["name"], {})
    path = [
        {"step": 1, "title": "前置基础 / Prerequisites",
         "detail": "线性代数 / 概率论 / 数值优化 —— 数学方法关键词："
                   + ", ".join(target["math_methods"][:4])},
        {"step": 2, "title": f"算法族基础 / {target['family']} basics",
         "detail": f"先理解 {target['family']} 这一族算法的共同目标（task: {target['task'] or '—'}）"},
        {"step": 3, "title": "模块综述 / Module survey",
         "detail": f"{module} 模块共 {len(rows)} 个算法类，先浏览同族实现：",
         "items": [{"name": s["name"], "note": (s["docstring_math"] or "")[:60]}
                   for s in siblings[:8]]},
        {"step": 4, "title": f"目标算法 / {target['name']}",
         "detail": tnote.get("summary") or (target["docstring_math"] or "")[:120]
                   or "结合源码与上面的数学描述精读",
         "items": [{"name": target["name"],
                    "note": f"参数: {', '.join(target['params'][:4]) or '—'}"}]},
    ]
    return {"module": module, "algorithm": target["name"], "path": path}


def similar(algorithm, module="", top_k=3):
    """相似算法推荐：embedding 余弦 + 同模块 / 同算法族 / 引用共现三路召回。"""
    if not algorithm:
        return {"error": "algorithm query param required / 需要 algorithm 参数"}
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("SELECT id, name, module, family, embedding_json, call_edges "
                "FROM algorithms WHERE name = %s", (algorithm,))
    rows = cur.fetchall()
    if module:
        rows = [r for r in rows if r[2] == module]
    if not rows:
        conn.close()
        return {"algorithm": algorithm, "semantic": [], "same_module": [],
                "same_family": [], "coreference": []}
    tid, tname, tmod, tfam, temb, tcall = rows[0]
    tvec = _jload(temb, [])
    tcalls = set(_jload(tcall, []))

    cur.execute("SELECT id, name, module, family, embedding_json, call_edges "
                "FROM algorithms")
    allrows = cur.fetchall()
    conn.close()

    scored = []
    for (aid, name, mod, family, emb, calls) in allrows:
        if aid == tid:
            continue
        vec = _jload(emb, [])
        score = parser.cosine(tvec, vec) if (tvec and vec) else 0.0
        scored.append((aid, name, mod, family, score, set(_jload(calls, []))))

    scored.sort(key=lambda x: -x[4])
    semantic = [{"name": n, "module": m, "family": f, "score": round(s, 4)}
                for (_, n, m, f, s, _) in scored[:top_k]]

    same_module = [{"name": n, "module": m, "family": f}
                   for (_, n, m, f, _, _) in scored if m == tmod][:5]
    same_family = [{"name": n, "module": m, "family": f}
                   for (_, n, m, f, _, _) in scored if f == tfam and m != tmod][:5]

    coref = []
    for (_, n, m, f, _, calls) in scored:
        if m != tmod:
            continue
        shared = tcalls & calls
        if shared:
            coref.append({"name": n, "module": m, "shared": sorted(shared)[:4],
                          "shared_count": len(shared)})
    coref.sort(key=lambda x: -x["shared_count"])

    return {"algorithm": tname, "module": tmod, "family": tfam,
            "semantic": semantic, "same_module": same_module,
            "same_family": same_family, "coreference": coref[:5]}


def call_graph(module, algorithm=None):
    """调用关系图：目标类 + 成员方法 + 调用符号解析 + 继承边。"""
    if not module:
        return {"error": "module query param required / 需要 module 参数"}
    conn = db.get_conn()
    cur = conn.cursor()
    rows = _fetch_algos(cur, module, algorithm)
    if not rows:
        conn.close()
        return {"module": module, "algorithm": algorithm, "nodes": [], "edges": []}
    target = rows[0]

    # 成员方法（functions 表存的 name 可能带 "类名.方法名" 前缀，两种都收集）
    cur.execute("SELECT name FROM functions WHERE class_id = %s ORDER BY id",
                (target["id"],))
    methods = [r[0] for r in cur.fetchall()]
    method_full = set(methods)
    method_short = {m.split(".")[-1] for m in methods}

    # 全局类名 / 函数名，用于解析调用与继承
    cur.execute("SELECT DISTINCT name FROM algorithms")
    class_names = {r[0] for r in cur.fetchall()}
    cur.execute("SELECT DISTINCT name FROM functions")
    fn_names = {r[0] for r in cur.fetchall()}
    conn.close()

    nodes = [{"id": f"class:{target['name']}", "label": target["name"], "type": "class"}]
    edges = []
    ext_calls, unresolved = [], []
    for sym in target["call_edges"]:
        if sym in method_full or sym in method_short:
            continue  # 成员方法单独列，不作为外部调用边
        if sym in class_names:
            nodes.append({"id": f"class:{sym}", "label": sym, "type": "class"})
            edges.append({"from": target["name"], "to": sym, "rel": "calls"})
        elif sym in fn_names and sym not in [n["label"] for n in nodes]:
            nodes.append({"id": f"fn:{sym}", "label": sym, "type": "function"})
            edges.append({"from": target["name"], "to": sym, "rel": "calls"})
            ext_calls.append(sym)
        elif sym not in [n["label"] for n in nodes]:
            unresolved.append(sym)

    for base in target["ref_edges"].get("bases", []):
        if base == "object":
            continue
        if base in class_names:
            nodes.append({"id": f"class:{base}", "label": base, "type": "class"})
            edges.append({"from": target["name"], "to": base, "rel": "inherits"})

    method_nodes = [{"id": f"method:{m}", "label": m, "type": "method"} for m in methods]
    method_edges = [{"from": target["name"], "to": m, "rel": "method"} for m in methods]

    # 去重节点
    seen, uniq_nodes = set(), []
    for n in nodes + method_nodes:
        if n["id"] not in seen:
            seen.add(n["id"])
            uniq_nodes.append(n)

    return {
        "module": module, "algorithm": target["name"],
        "nodes": uniq_nodes,
        "edges": edges + method_edges,
        "summary": {
            "methods": len(methods), "external_calls": len(ext_calls),
            "inherits": sum(1 for e in edges if e["rel"] == "inherits"),
            "unresolved_symbols": len(unresolved),
        },
    }
