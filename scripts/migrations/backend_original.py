"""FastAPI 后端：前端 ↔ MySQL 之间的中间层，也是 RAG 的主流程。

接口：
  GET  /api/sample        返回示例代码
  POST /api/index         入库粘贴代码：解析 → 多级 chunk → embedding → 写 MySQL
  POST /api/index_repo    导入 GitHub 仓库（git clone → 遍历 .py → 类级切分 → 入库）
  POST /api/search        检索：FULLTEXT 关键词 + 语义(余弦) 混合打分 → Top-K（支持 module/family/task 过滤）
  POST /api/reset         清空三表
  GET  /api/stats         返回当前数据库状态 + 模块/算法族列表
  GET  /api/debug/chunks  列出库内所有 chunk + 向量头（RAG 版 phpMyAdmin 浏览表）
  POST /api/debug/search  拆开一次检索：query 向量 + 每个候选的关键词/余弦/融合分
"""
import json
import os
import re
import subprocess
import tempfile
import shutil

from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

import db
import parser

app = FastAPI(title="Code X-Ray")
db.init_db()  # 启动时确保库表存在（含 v2 新增列）

SAMPLE_PATH = os.path.join(os.path.dirname(__file__), "sample", "sample_code.py")


class IndexReq(BaseModel):
    code: str
    filename: str = "pasted.py"


class SearchReq(BaseModel):
    query: str
    top_k: int = 5
    module: str = ""
    family: str = ""
    task: str = ""


class IndexRepoReq(BaseModel):
    repo_url: str = "https://github.com/ddbourgin/numpy-ml"
    branch: str = "master"
    reset_first: bool = True


# ---------------------------------------------------------------------------
# 基础接口
# ---------------------------------------------------------------------------
@app.get("/api/sample")
def sample():
    with open(SAMPLE_PATH) as f:
        return {"filename": "sample_code.py", "code": f.read()}


def _reset_all():
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("SET FOREIGN_KEY_CHECKS=0")
    for t in ("functions", "algorithms", "code_chunks", "code_files", "modules", "projects"):
        cur.execute(f"TRUNCATE TABLE {t}")
    cur.execute("SET FOREIGN_KEY_CHECKS=1")
    conn.close()


@app.post("/api/reset")
def reset():
    """清空三张表，方便反复演示/测试（demo 用，生产不需要）。"""
    _reset_all()
    return {"reset": True}


@app.get("/api/stats")
def stats():
    """返回当前数据库里有多少项目/文件/chunk，以及模块与算法族列表。"""
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM projects")
    pc = cur.fetchone()[0]
    non_algo = tuple(parser.NON_ALGO_MODULES)
    cur.execute("SELECT COUNT(*) FROM code_files WHERE module NOT IN %s OR module=''", (non_algo,))
    fc = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM algorithms WHERE module NOT IN %s OR module=''", (non_algo,))
    ac = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM functions WHERE module NOT IN %s OR module=''", (non_algo,))
    fnc = cur.fetchone()[0]
    cc = ac + fnc
    cur.execute("SELECT COUNT(DISTINCT name) FROM algorithms WHERE module NOT IN %s OR module=''", (non_algo,))
    clsc = cur.fetchone()[0]
    cur.execute("SELECT path FROM code_files WHERE module NOT IN %s OR module='' ORDER BY id", (non_algo,))
    files = [r[0] for r in cur.fetchall()]
    cur.execute("SELECT name FROM modules WHERE name NOT IN %s ORDER BY name", (non_algo,))
    modules = [r[0] for r in cur.fetchall()]
    cur.execute("""
        SELECT family FROM (
            SELECT DISTINCT family FROM algorithms WHERE family<>'' AND (module NOT IN %s OR module='')
            UNION
            SELECT DISTINCT family FROM functions WHERE family<>'' AND (module NOT IN %s OR module='')
        ) t ORDER BY family
    """, (non_algo, non_algo))
    families = [r[0] for r in cur.fetchall()]
    cur.execute("""
        SELECT task FROM (
            SELECT DISTINCT task FROM algorithms WHERE task<>'' AND (module NOT IN %s OR module='')
            UNION
            SELECT DISTINCT task FROM functions WHERE task<>'' AND (module NOT IN %s OR module='')
        ) t ORDER BY task
    """, (non_algo, non_algo))
    tasks = [r[0] for r in cur.fetchall()]
    conn.close()
    return {
        "projects": pc, "files": fc, "chunks": cc,
        "classes": clsc, "functions": fnc,
        "indexed_files": files,
        "modules": modules, "families": families, "tasks": tasks,
    }


# ---------------------------------------------------------------------------
# 入库逻辑
# ---------------------------------------------------------------------------
def _index_code(code, filename, module_path="", project_id=None, module_id=None):
    """解析代码为 class / function 级 chunk，生成 embedding，写入 MySQL。返回 chunk 数。
    若 project_id 已提供则复用该项目，否则为单个文件新建一个项目。"""
    chunks = parser.extract_chunks(code, filename, module_path)

    conn = db.get_conn()
    cur = conn.cursor()
    # Demo 阶段：同名文件重新入库时先清旧数据，避免重复
    cur.execute(
        "DELETE c FROM code_chunks c JOIN code_files f ON c.file_id=f.id WHERE f.path=%s",
        (filename,),
    )
    cur.execute("DELETE FROM code_files WHERE path=%s", (filename,))

    if project_id is None:
        cur.execute("DELETE FROM projects WHERE name=%s", (filename,))
        cur.execute("INSERT INTO projects(name) VALUES(%s)", (filename,))
        project_id = cur.lastrowid

    cur.execute(
        "INSERT INTO code_files(project_id,module_id,path,language,module) VALUES(%s,%s,%s,'python',%s)",
        (project_id, module_id, filename, module_path),
    )
    fid = cur.lastrowid

    # 跟踪「当前 class」在 algorithms 表里的 id，让 method/function 通过 class_id 指向它，
    # 形成 modules → code_files → algorithms → functions 四层外键链。
    current_class_id = None
    for ch in chunks:
        vec = parser.embed(ch["embedding_text"])
        if ch["chunk_type"] == "class":
            cur.execute(
                "INSERT INTO algorithms(file_id,name,module,family,task,math_methods,params,"
                "`references`,docstring_math,complexity,ref_edges,call_edges,"
                "start_line,end_line,code_text,embedding_text,embedding_json,chunk_metadata) "
                "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (fid, ch["entity_name"], ch.get("module", ""), ch.get("family", ""), ch.get("task", ""),
                 ch.get("math_methods", "[]"), ch.get("params", ""), ch.get("references", "[]"),
                 ch.get("docstring_math", ""), ch.get("complexity", 0.0),
                 ch.get("ref_edges", "[]"), ch.get("call_edges", "[]"),
                 ch["start_line"], ch["end_line"], ch["code_text"],
                 ch["embedding_text"], json.dumps(vec), json.dumps({})),
            )
            current_class_id = cur.lastrowid
        else:
            # 顶层函数没有 parent_class，class_id 留空；method 跟随所属 class。
            class_id = current_class_id if ch.get("parent_class") else None
            cur.execute(
                "INSERT INTO functions(file_id,class_id,name,parent_class,module,family,task,math_methods,params,"
                "`references`,docstring_math,complexity,ref_edges,call_edges,"
                "start_line,end_line,code_text,embedding_text,embedding_json,chunk_metadata) "
                "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (fid, class_id, ch["entity_name"], ch.get("parent_class"),
                 ch.get("module", ""), ch.get("family", ""), ch.get("task", ""),
                 ch.get("math_methods", "[]"), ch.get("params", ""), ch.get("references", "[]"),
                 ch.get("docstring_math", ""), ch.get("complexity", 0.0),
                 ch.get("ref_edges", "[]"), ch.get("call_edges", "[]"),
                 ch["start_line"], ch["end_line"], ch["code_text"],
                 ch["embedding_text"], json.dumps(vec), json.dumps({})),
            )
    conn.close()
    return len(chunks)


@app.post("/api/index")
def index(req: IndexReq):
    """解析粘贴的代码为多级 chunk，生成 embedding，写入 MySQL。"""
    n = _index_code(req.code, req.filename)
    return {"file_id": req.filename, "chunks_indexed": n}


@app.post("/api/index_repo")
def index_repo(req: IndexRepoReq):
    """从 GitHub 导入仓库：git clone → 遍历 .py → 类级切分 → 嵌入 → 入库。"""
    if req.reset_first:
        _reset_all()

    tmp = tempfile.mkdtemp(prefix="codexray_")
    try:
        subprocess.run(
            ["git", "clone", "--depth", "1", "-b", req.branch, req.repo_url, tmp],
            check=True, capture_output=True, text=True, timeout=300,
        )
    except subprocess.CalledProcessError as e:
        shutil.rmtree(tmp, ignore_errors=True)
        return {"error": "git clone failed", "detail": (e.stderr or "")[:500]}
    except subprocess.TimeoutExpired:
        shutil.rmtree(tmp, ignore_errors=True)
        return {"error": "git clone timeout (>300s)"}

    # 用一个项目统领整个仓库
    repo_name = req.repo_url.rstrip("/").split("/")[-1].replace(".git", "") or "repo"
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO projects(name) VALUES(%s)", (repo_name,))
    project_id = cur.lastrowid
    conn.close()

    # 读取仓库 README，按模块切分（模块搜索时原样展示 README 内容）
    readme_sections = {}
    for readme_candidate in (os.path.join(tmp, "README.md"), os.path.join(tmp, "numpy_ml", "README.md")):
        readme_sections = parser.extract_module_readmes(readme_candidate)
        if readme_sections:
            break

    # 先按模块目录分组，确保每个模块在 modules 表中有一行
    from collections import defaultdict
    module_files = defaultdict(list)
    for root, _, fns in os.walk(tmp):
        for fn in fns:
            if not fn.endswith(".py"):
                continue
            p = os.path.join(root, fn)
            rel = os.path.relpath(p, tmp)
            parts = rel.split("/")
            # numpy-ml clone 后顶层是 Python 包目录名（numpy_ml），真正的算法子模块在下一层
            if len(parts) >= 3 and parts[0] in ("numpy_ml", "numpy-ml"):
                module = parts[1]
            else:
                module = ""
            if module in parser.NON_ALGO_MODULES:
                continue
            module_files[module].append((p, rel))

    # 创建 modules 表记录（空模块名是顶层 loose 文件，不建模块行）
    module_id_map = {"": None}
    conn = db.get_conn()
    cur = conn.cursor()
    for module in sorted(module_files.keys()):
        if not module or module in parser.NON_ALGO_MODULES:
            continue
        family = parser.FAMILY_MAP.get(module, "Other")
        readme = readme_sections.get(module, "")
        cur.execute(
            "INSERT INTO modules(project_id,name,family,task,readme) VALUES(%s,%s,%s,%s,%s) "
            "ON DUPLICATE KEY UPDATE family=VALUES(family), task=VALUES(task), readme=VALUES(readme)",
            (project_id, module, family, "other", readme),
        )
        cur.execute("SELECT id FROM modules WHERE project_id=%s AND name=%s", (project_id, module))
        module_id_map[module] = cur.fetchone()[0]
    conn.close()

    files = 0
    chunks = 0
    for module, entries in module_files.items():
        module_id = module_id_map[module]
        for p, rel in entries:
            try:
                code = open(p, encoding="utf-8", errors="replace").read()
            except Exception:
                continue
            try:
                n = _index_code(code, rel, module, project_id=project_id, module_id=module_id)
                if n:
                    files += 1
                    chunks += n
            except Exception:
                # 单个文件解析失败不阻断整体导入
                continue
    shutil.rmtree(tmp, ignore_errors=True)
    return {"repo": req.repo_url, "project": repo_name, "files": files, "chunks": chunks}


# ---------------------------------------------------------------------------
# 检索
# ---------------------------------------------------------------------------
def _rank(req):
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


@app.post("/api/search")
def search(req: SearchReq):
    results, _ = _rank(req)
    for x in results:
        x.pop("vector", None)  # 普通搜索不暴露完整向量
    return {"query": req.query, "results": results[: req.top_k]}


@app.get("/api/debug/chunks")
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


@app.post("/api/debug/search")
def debug_search(req: SearchReq):
    """把一次检索拆开给你看：query 向量、每个候选 chunk 的关键词分/余弦分/融合分/向量头。"""
    results, qvec = _rank(req)
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


@app.get("/api/modules")
def modules():
    """返回算法模块列表（不含 tests/plots），每个模块带文件数、类数、函数数、示例算法名。"""
    conn = db.get_conn()
    cur = conn.cursor()
    non_algo = tuple(parser.NON_ALGO_MODULES)
    cur.execute("SELECT id, name, family, readme FROM modules WHERE name NOT IN %s ORDER BY name", (non_algo,))
    rows = cur.fetchall()
    out = []
    for mid, name, family, readme in rows:
        cur.execute("SELECT COUNT(*) FROM code_files WHERE module_id=%s", (mid,))
        file_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM algorithms a JOIN code_files f ON a.file_id=f.id WHERE f.module_id=%s", (mid,))
        class_count = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM functions fn JOIN code_files f ON fn.file_id=f.id WHERE f.module_id=%s", (mid,))
        function_count = cur.fetchone()[0]
        cur.execute(
            "SELECT a.name FROM algorithms a JOIN code_files f ON a.file_id=f.id WHERE f.module_id=%s ORDER BY a.id LIMIT 5",
            (mid,),
        )
        samples = [r[0] for r in cur.fetchall()]
        out.append({
            "name": name,
            "family": family or parser.FAMILY_MAP.get(name, "Other"),
            "file_count": file_count,
            "class_count": class_count,
            "function_count": function_count,
            "samples": samples,
            "readme": readme or "",
            "description": f"{family or parser.FAMILY_MAP.get(name, 'Module')} — {class_count or 0} algorithm classes, {function_count or 0} functions.",
        })
    conn.close()
    return {"modules": out}


# 前端首页：直接返回 index.html。前端通过 fetch 调 /api/* 接口，与后端同源，无需 CORS。
@app.get("/")
def index_page():
    return FileResponse(os.path.join(os.path.dirname(__file__), "frontend", "index.html"))
