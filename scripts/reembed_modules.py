"""一次性脚本：把 modules 表现有行的 readme_embedding 重算为「富集向量」
（name + 算法族 + 别名 + README）。用于方案 3 升级模块语义表示后，免重解析仓库直接刷新。

用法：PYTHONPATH=. .venv/bin/python scripts/reembed_modules.py
"""
import json
from backend import db, parser


def main():
    conn = db.get_conn()
    cur = conn.cursor()
    non_algo = tuple(parser.NON_ALGO_MODULES)
    cur.execute(
        "SELECT id, name, family, readme, aliases FROM modules WHERE name NOT IN %s",
        (non_algo,),
    )
    rows = cur.fetchall()
    print("待重算模块数:", len(rows))
    for mid, name, family, readme, aliases in rows:
        try:
            al = json.loads(aliases) if aliases else []
        except Exception:
            al = []
        vec = parser.embed_module(name, family, al, readme) if readme else [0.0] * parser.DIM
        cur.execute(
            "UPDATE modules SET readme_embedding=%s WHERE id=%s",
            (json.dumps(vec), mid),
        )
        print("  updated:", name, "dim=", len(vec))
    conn.commit()
    conn.close()
    print("完成。")


if __name__ == "__main__":
    main()
