"""Code X-Ray backend assembly entry point (FastAPI).

Responsibilities: route assembly and startup entry only; no business logic.
- Retrieval: backend/retrieval.py (task 1)
- Learning module: backend/learn.py (task 2)
- Evaluation tests: tests/eval_test.py (task 3)
- Indexing pipeline: backend/index_pipeline.py
- Database / parser: backend/db.py, backend/parser.py

Startup: run `uvicorn backend.app:app --reload --port 8000` from the repository root
"""
import os
import sys
import json

# Ensure the backend package can be imported no matter which directory it is started from
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

# The evaluation module eval_test.py lives in tests/; add it to the path so the app can load it (provides endpoints such as /api/eval)
TESTS_DIR = os.path.join(REPO_ROOT, "tests")
if TESTS_DIR not in sys.path:
    sys.path.insert(0, TESTS_DIR)

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend import db, parser
from backend import retrieval, learn, index_pipeline
from backend.embedding_index import EmbeddingIndexError
import eval_test  # The evaluation module lives in tests/ and has been added to sys.path

app = FastAPI(title="Code X-Ray")


@app.exception_handler(EmbeddingIndexError)
async def embedding_index_error(request, exc):
    return JSONResponse(status_code=503, content={"detail": str(exc)})


db.init_db()  # Ensure tables exist at startup (including new v2 columns)

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
# Basic / meta endpoints
# ---------------------------------------------------------------------------
@app.get("/api/sample")
def sample():
    with open(SAMPLE_PATH) as f:
        return {"filename": "sample_code.py", "code": f.read()}


@app.post("/api/reset")
def reset():
    """Clear all six tables for repeated demos/testing (for demos only, not needed in production)."""
    require_admin_api()
    index_pipeline.reset_all()
    return {"reset": True}


@app.get("/api/stats")
def stats():
    """Return how many projects/files/chunks are in the database, plus lists of modules and algorithm families."""
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
# Indexing
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
# Retrieval (retrieval.py)
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
# Module list
# ---------------------------------------------------------------------------
@app.get("/api/modules")
def modules():
    """Return the list of algorithm modules (excluding tests/plots), each with file count, class count, function count, and sample algorithm names."""
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
    """Hybrid module retrieval: keywords + README semantics, fused with RRF (task 1, plan 3)."""
    return retrieval.module_search(req)


# ---------------------------------------------------------------------------
# Learning section (learn.py)
# ---------------------------------------------------------------------------
@app.get("/api/learn/modules")
def learn_modules():
    return learn.list_modules()


@app.get("/api/learn/card")
def learn_card(module: str = "", algorithm: str = ""):
    return learn.get_card(module, algorithm or None)


@app.get("/api/learn/algorithm")
def learn_algorithm(module: str = "", algorithm: str = "", path: str = ""):
    if not algorithm:
        raise HTTPException(status_code=400, detail="An algorithm name is required.")
    return learn.get_algorithm(module, algorithm, path)


@app.get("/api/learn/compare")
def learn_compare(module: str = ""):
    return learn.compare(module)


@app.get("/api/learn/path")
def learn_path(module: str = "", algorithm: str = "", path: str = ""):
    return learn.learning_path(module or None, algorithm or None, path)


@app.get("/api/learn/call_graph")
def learn_call_graph(module: str = "", entity: str = "", path: str = ""):
    return learn.call_graph(module=module, entity=entity, path=path)


# ---------------------------------------------------------------------------
# Evaluation tests (eval_test.py)
# ---------------------------------------------------------------------------
@app.get("/api/eval")
def eval_endpoint():
    require_admin_api()
    return eval_test.evaluate_two_stage_pipeline()


@app.get("/api/eval/modules")
def eval_modules_endpoint():
    require_admin_api()
    return eval_test.evaluate_modules()


@app.get("/api/eval/class_search")
def eval_class_search_endpoint(kw_weight: float = 0.2, top_k: int = 5):
    """3.2 class retrieval evaluation; kw_weight is the keyword channel weight, semantic = 1 - kw_weight."""
    require_admin_api()
    return eval_test.run_ablation_study()


@app.get("/api/smoke")
def smoke_endpoint():
    return eval_test.smoke_test()


# ---------------------------------------------------------------------------
# Frontend home page
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
