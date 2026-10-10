"""Code X-Ray 后端装配入口（FastAPI）。

职责：仅做路由装配与启动入口，不写业务逻辑。
- 检索精度：backend/retrieval.py（分工 1）
- 学习板块：backend/learn.py（分工 2）
- 评估测试：tests/eval_test.py（分工 3）
- 入库管线：backend/index_pipeline.py
- 数据库 / 解析：backend/db.py、backend/parser.py

启动：在仓库根目录执行 `uvicorn backend.app:app --reload --port 8000`
"""
import os
import sys
import json

# 保证无论从哪个目录启动，backend 包都可被导入
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

# 评测模块 eval_test.py 位于 tests/，加入路径供 app 加载（提供 /api/eval 等端点）
TESTS_DIR = os.path.join(REPO_ROOT, "tests")
if TESTS_DIR not in sys.path:
    sys.path.insert(0, TESTS_DIR)

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend import db, parser
from backend import retrieval, learn, index_pipeline
import eval_test  # 评测模块位于 tests/，已加入 sys.path

app = FastAPI(title="Code X-Ray")
db.init_db()  # 启动时确保库表存在（含 v2 新增列）

SAMPLE_PATH = os.path.join(REPO_ROOT, "sample", "sample_code.py")
LEGACY_FRONTEND_PATH = os.path.join(REPO_ROOT, "frontend", "legacy-index.html")
FRONTEND_DIST_PATH = os.path.join(REPO_ROOT, "frontend", "dist")
FRONTEND_INDEX_PATH = os.path.join(FRONTEND_DIST_PATH, "index.html")
FRONTEND_ASSETS_PATH = os.path.join(FRONTEND_DIST_PATH, "assets")

if os.path.isdir(FRONTEND_ASSETS_PATH):
    app.mount("/assets", StaticFiles(directory=FRONTEND_ASSETS_PATH), name="frontend-assets")

ADMIN_API_ENABLED = os.environ.get("ENABLE_ADMIN_API", "1").strip().lower() in {
    "1", "true", "yes", "on",
}


def require_admin_api():
    if not ADMIN_API_ENABLED:
        raise HTTPException(status_code=403, detail="Admin API is disabled")


class IndexReq(BaseModel):
    code: str
    filename: str = "pasted.py"


class SearchReq(BaseModel):
    query: str
    top_k: int = Field(default=3, ge=1, le=10, description="Algorithm class search result limit (1-10)")
    module: str = ""
    family: str = ""
    task: str = ""


class IndexRepoReq(BaseModel):
    repo_url: str = "https://github.com/ddbourgin/numpy-ml"
    branch: str = "master"
    reset_first: bool = True


class ModuleSearchReq(BaseModel):
    query: str = ""
    top_k: int = Field(default=1, ge=1, le=3, description="Module search result limit (1-3)")


# ---------------------------------------------------------------------------
# 基础 / 元接口
# ---------------------------------------------------------------------------
@app.get("/api/sample")
def sample():
    with open(SAMPLE_PATH) as f:
        return {"filename": "sample_code.py", "code": f.read()}


@app.post("/api/reset")
def reset():
    """清空六张表，方便反复演示/测试（demo 用，生产不需要）。"""
    require_admin_api()
    index_pipeline.reset_all()
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
# 入库
# ---------------------------------------------------------------------------
@app.post("/api/index")
def index(req: IndexReq):
    require_admin_api()
    return index_pipeline.index_pasted(req.code, req.filename)


@app.post("/api/index_repo")
def index_repo(req: IndexRepoReq):
    require_admin_api()
    return index_pipeline.index_repo(req.repo_url, req.branch, req.reset_first)


# ---------------------------------------------------------------------------
# 检索（retrieval.py）
# ---------------------------------------------------------------------------
@app.post("/api/search")
def search(req: SearchReq):
    return retrieval.run_search(req)


@app.get("/api/debug/chunks")
def debug_chunks():
    require_admin_api()
    return retrieval.debug_chunks()


@app.post("/api/debug/search")
def debug_search(req: SearchReq):
    require_admin_api()
    return retrieval.debug_search(req)


# ---------------------------------------------------------------------------
# 模块列表
# ---------------------------------------------------------------------------
@app.get("/api/modules")
def modules():
    """返回算法模块列表（不含 tests/plots），每个模块带文件数、类数、函数数、示例算法名。"""
    conn = db.get_conn()
    cur = conn.cursor()
    non_algo = tuple(parser.NON_ALGO_MODULES)
    cur.execute("SELECT id, name, family, readme, aliases FROM modules WHERE name NOT IN %s ORDER BY name", (non_algo,))
    rows = cur.fetchall()
    out = retrieval.build_module_cards(cur, rows)
    conn.close()
    return {"modules": out}


@app.post("/api/modules/search")
def modules_search(req: ModuleSearchReq):
    """模块混合检索：关键词 + README 语义，RRF 融合（分工 1 · 方案 3）。"""
    return retrieval.module_search(req)


# ---------------------------------------------------------------------------
# 学习板块（learn.py）
# ---------------------------------------------------------------------------
@app.get("/api/learn/modules")
def learn_modules():
    return learn.list_modules()


@app.get("/api/learn/card")
def learn_card(module: str = "", algorithm: str = ""):
    return learn.get_card(module, algorithm or None)


@app.get("/api/learn/compare")
def learn_compare(module: str = ""):
    return learn.compare(module)


@app.get("/api/learn/path")
def learn_path(module: str = ""):
    return learn.learning_path(module or None)


@app.get("/api/learn/call_graph")
def learn_call_graph(module: str = "", entity: str = "", path: str = ""):
    return learn.call_graph(module=module, entity=entity, path=path)


# ---------------------------------------------------------------------------
# 评估测试（eval_test.py）
# ---------------------------------------------------------------------------
@app.get("/api/eval")
def eval_endpoint():
    require_admin_api()
    return eval_test.evaluate()


@app.get("/api/eval/modules")
def eval_modules_endpoint():
    require_admin_api()
    return eval_test.evaluate_modules()


@app.get("/api/eval/class_search")
def eval_class_search_endpoint(kw_weight: float = 0.2, top_k: int = 5):
    """3.2 分类检索评测；kw_weight 为 keyword 通道权重，semantic = 1 - kw_weight。"""
    require_admin_api()
    return eval_test.evaluate_class_search(kw_weight=kw_weight, top_k=top_k)


@app.get("/api/smoke")
def smoke_endpoint():
    return eval_test.smoke_test()


# ---------------------------------------------------------------------------
# 前端首页
# ---------------------------------------------------------------------------
@app.get("/")
def index_page():
    frontend_path = FRONTEND_INDEX_PATH if os.path.isfile(FRONTEND_INDEX_PATH) else LEGACY_FRONTEND_PATH
    return FileResponse(
        frontend_path,
        headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
    )


@app.get("/{frontend_path:path}")
def frontend_fallback(frontend_path: str):
    """Serve the React entry point for direct browser navigation.

    Unknown API paths remain real 404 responses instead of returning HTML.
    """
    if frontend_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
    if os.path.isfile(FRONTEND_INDEX_PATH):
        return FileResponse(
            FRONTEND_INDEX_PATH,
            headers={"Cache-Control": "no-cache, no-store, must-revalidate"},
        )
    raise HTTPException(status_code=404, detail="Frontend build not found")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=False)
