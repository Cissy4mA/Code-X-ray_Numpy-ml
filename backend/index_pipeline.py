"""Indexing pipeline: index pasted code + import GitHub repositories.

Stable layer: parses, splits, and embeds code repositories before writing them to MySQL.
If the learning module (task 2) needs new data, append corresponding tables/JSON rather than
modifying this file, so changes do not conflict with retrieval.py changes when merging.
"""
import json
import os
import shutil
import subprocess
import tempfile
from collections import defaultdict

from backend import db, parser
from backend.embedding_index import prepare_for_indexing


def reset_all():
    """Clear all six tables for repeated demos/testing (for demos only, not needed in production)."""
    conn = db.get_conn()
    cur = conn.cursor()
    if not db.is_sqlite():
        cur.execute("SET FOREIGN_KEY_CHECKS=0")
    for t in ("functions", "algorithms", "code_files", "modules", "projects"):
        if db.is_sqlite():
            cur.execute(f"DELETE FROM {t}")
        else:
            cur.execute(f"TRUNCATE TABLE {t}")
    if db.is_sqlite():
        cur.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='embedding_index'")
        if cur.fetchone():
            cur.execute("DELETE FROM embedding_index")
    if not db.is_sqlite():
        cur.execute("SET FOREIGN_KEY_CHECKS=1")
    conn.close()


def index_code(code, filename, module_path="", project_id=None, module_id=None):
    """Parse code into class/function-level chunks, generate embeddings, write to MySQL. Return the chunk count.
    Reuse the project if project_id is provided; otherwise create a new project for a single file."""
    prepare_for_indexing()
    chunks = parser.extract_chunks(code, filename, module_path)

    conn = db.get_conn()
    cur = conn.cursor()
    # Demo phase: clear old data first when re-indexing a file with the same name, to avoid duplicates
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

    # Track the id of the "current class" in the algorithms table so methods/functions point to it via class_id,
    # forming a four-level foreign key chain: modules -> code_files -> algorithms -> functions.
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
            # Top-level functions have no parent_class and leave class_id empty; methods follow their owning class.
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


def index_pasted(code, filename="pasted.py"):
    """Parse pasted code into multi-level chunks, generate embeddings, write to MySQL."""
    n = index_code(code, filename)
    return {"file_id": filename, "chunks_indexed": n}


def index_repo(repo_url="https://github.com/ddbourgin/numpy-ml", branch="master",
               reset_first=True):
    """Import a repository from GitHub: git clone -> walk .py files -> class-level splitting -> embedding -> indexing."""
    if reset_first:
        reset_all()

    prepare_for_indexing()

    cleanup_tmp = False
    if os.path.isdir(repo_url):
        tmp = repo_url
    else:
        tmp = tempfile.mkdtemp(prefix="codexray_")
        cleanup_tmp = True
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", "-b", branch, repo_url, tmp],
                check=True, capture_output=True, text=True, timeout=300,
            )
        except subprocess.CalledProcessError as e:
            shutil.rmtree(tmp, ignore_errors=True)
            return {"error": "git clone failed", "detail": (e.stderr or "")[:500]}
        except subprocess.TimeoutExpired:
            shutil.rmtree(tmp, ignore_errors=True)
            return {"error": "git clone timeout (>300s)"}

    # Use one project to cover the whole repository
    repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "") or "repo"
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO projects(name) VALUES(%s)", (repo_name,))
    project_id = cur.lastrowid
    conn.close()

    # First group by module directory to ensure each module has a row in the modules table
    module_files = defaultdict(list)
    for root, _, fns in os.walk(tmp):
        for fn in fns:
            if not fn.endswith(".py"):
                continue
            p = os.path.join(root, fn)
            rel = os.path.relpath(p, tmp)
            parts = rel.split("/")
            # After cloning numpy-ml, the top level is the Python package directory (numpy_ml); the actual algorithm submodules are one level deeper
            if len(parts) >= 3 and parts[0] in ("numpy_ml", "numpy-ml"):
                module = parts[1]
            else:
                module = ""
            if module in parser.NON_ALGO_MODULES:
                continue
            module_files[module].append((p, rel))

    # Read the repository README and split it by module (fallback when no module-specific README exists)
    readme_sections = {}
    for readme_candidate in (os.path.join(tmp, "README.md"), os.path.join(tmp, "numpy_ml", "README.md")):
        readme_sections = parser.extract_module_readmes(readme_candidate)
        if readme_sections:
            break

    # Prefer module-specific READMEs (e.g. numpy_ml/neural_nets/README.md); fall back to the overview if absent
    module_readme = {}
    for module in sorted(module_files.keys()):
        if not module or module in parser.NON_ALGO_MODULES:
            continue
        specific = os.path.join(tmp, "numpy_ml", module, "README.md")
        if os.path.isfile(specific):
            raw_readme = open(specific, encoding="utf-8", errors="replace").read()
        else:
            raw_readme = readme_sections.get(module, "")
        module_readme[module] = parser.rewrite_image_paths(raw_readme, module, repo_url, branch)

    # Create modules table rows (an empty module name means top-level loose files; no module row is created)
    module_id_map = {"": None}
    conn = db.get_conn()
    cur = conn.cursor()
    for module in sorted(module_files.keys()):
        if not module or module in parser.NON_ALGO_MODULES:
            continue
        family = parser.FAMILY_MAP.get(module, "Other")
        readme = module_readme.get(module, "")
        aliases = parser.MODULE_ALIASES.get(module, [])
        # Plan 3: generate an "enriched semantic vector" for the module - name + algorithm family + aliases
        # + README encoded together, so module-level semantic retrieval can hit the alias/concept layer
        # (e.g. "normalize and scale features" -> preprocessing)
        readme_vec = parser.embed_module(module, family, aliases, readme)
        if db.is_sqlite():
            cur.execute(
                "INSERT INTO modules(project_id,name,family,task,readme,aliases,readme_embedding) "
                "VALUES(%s,%s,%s,%s,%s,%s,%s) "
                "ON CONFLICT(project_id,name) DO UPDATE SET "
                "family=excluded.family, task=excluded.task, readme=excluded.readme, "
                "aliases=excluded.aliases, readme_embedding=excluded.readme_embedding",
                (project_id, module, family, "other", readme, json.dumps(aliases, ensure_ascii=False), json.dumps(readme_vec)),
            )
        else:
            cur.execute(
                "INSERT INTO modules(project_id,name,family,task,readme,aliases,readme_embedding) VALUES(%s,%s,%s,%s,%s,%s,%s) "
                "ON DUPLICATE KEY UPDATE family=VALUES(family), task=VALUES(task), readme=VALUES(readme), "
                "aliases=VALUES(aliases), readme_embedding=VALUES(readme_embedding)",
                (project_id, module, family, "other", readme, json.dumps(aliases, ensure_ascii=False), json.dumps(readme_vec)),
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
                n = index_code(code, rel, module, project_id=project_id, module_id=module_id)
                if n:
                    files += 1
                    chunks += n
            except Exception:
                # A single file failing to parse does not block the overall import
                continue
    if cleanup_tmp:
        shutil.rmtree(tmp, ignore_errors=True)
    return {"repo": repo_url, "project": repo_name, "files": files, "chunks": chunks}
