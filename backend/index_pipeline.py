"""入库管线：粘贴代码入库 + 导入 GitHub 仓库。

稳定层：负责把代码仓库解析、切分、嵌入后写入 MySQL。
学习板块（分工 2）若需新增数据，应追加对应的数据表/JSON，不建议修改本文件，
以免与检索精度（retrieval.py）的改动在合并时冲突。
"""
import json
import os
import shutil
import subprocess
import tempfile
from collections import defaultdict

from backend import db, parser


def reset_all():
    """清空六张表，方便反复演示/测试（demo 用，生产不需要）。"""
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("SET FOREIGN_KEY_CHECKS=0")
    for t in ("functions", "algorithms", "code_files", "modules", "projects"):
        cur.execute(f"TRUNCATE TABLE {t}")
    cur.execute("SET FOREIGN_KEY_CHECKS=1")
    conn.close()


def index_code(code, filename, module_path="", project_id=None, module_id=None):
    """解析代码为 class / function 级 chunk，生成 embedding，写入 MySQL。返回 chunk 数。
    若 project_id 已提供则复用该项目，否则为单个文件新建一个项目。"""
    chunks = parser.extract_chunks(code, filename, module_path)

    conn = db.get_conn()
    cur = conn.cursor()
    # Demo 阶段：同名文件重新入库时先清旧数据，避免重复
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


def index_pasted(code, filename="pasted.py"):
    """解析粘贴的代码为多级 chunk，生成 embedding，写入 MySQL。"""
    n = index_code(code, filename)
    return {"file_id": filename, "chunks_indexed": n}


def index_repo(repo_url="https://github.com/ddbourgin/numpy-ml", branch="master",
               reset_first=True):
    """从 GitHub 导入仓库：git clone → 遍历 .py → 类级切分 → 嵌入 → 入库。"""
    if reset_first:
        reset_all()

    tmp = tempfile.mkdtemp(prefix="codexray_")
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

    # 用一个项目统领整个仓库
    repo_name = repo_url.rstrip("/").split("/")[-1].replace(".git", "") or "repo"
    conn = db.get_conn()
    cur = conn.cursor()
    cur.execute("INSERT INTO projects(name) VALUES(%s)", (repo_name,))
    project_id = cur.lastrowid
    conn.close()

    # 先按模块目录分组，确保每个模块在 modules 表中有一行
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

    # 读取仓库 README，按模块切分（无模块专属 README 时作为 fallback）
    readme_sections = {}
    for readme_candidate in (os.path.join(tmp, "README.md"), os.path.join(tmp, "numpy_ml", "README.md")):
        readme_sections = parser.extract_module_readmes(readme_candidate)
        if readme_sections:
            break

    # 模块专属 README 优先（如 numpy_ml/neural_nets/README.md），没有再 fallback 到概览
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

    # 创建 modules 表记录（空模块名是顶层 loose 文件，不建模块行）
    module_id_map = {"": None}
    conn = db.get_conn()
    cur = conn.cursor()
    for module in sorted(module_files.keys()):
        if not module or module in parser.NON_ALGO_MODULES:
            continue
        family = parser.FAMILY_MAP.get(module, "Other")
        readme = module_readme.get(module, "")
        aliases = parser.MODULE_ALIASES.get(module, [])
        cur.execute(
            "INSERT INTO modules(project_id,name,family,task,readme,aliases) VALUES(%s,%s,%s,%s,%s,%s) "
            "ON DUPLICATE KEY UPDATE family=VALUES(family), task=VALUES(task), readme=VALUES(readme), aliases=VALUES(aliases)",
            (project_id, module, family, "other", readme, json.dumps(aliases, ensure_ascii=False)),
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
                # 单个文件解析失败不阻断整体导入
                continue
    shutil.rmtree(tmp, ignore_errors=True)
    return {"repo": repo_url, "project": repo_name, "files": files, "chunks": chunks}
