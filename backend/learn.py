"""学习板块（Learn Module）后端：数学原理卡片、算法对比、学习路径、调用关系图。

归属：分工2（两人）拥有。这是你们的功能开发主战场。

数据存放在 data/learn_content.json（仓库已带一份空模板）。你们直接往这个 JSON 里填内容，
或改写下面的函数接数据库 / 调 retrieval 也行。前端通过 /api/learn/* 拿数据，不用动 retrieval.py。
"""
import json
import os

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


def call_graph(module):
    """返回某模块的调用关系图（节点 + 边）。"""
    m = _module(module)
    return {"module": module, "call_graph": m.get("call_graph", {}) or {}}
