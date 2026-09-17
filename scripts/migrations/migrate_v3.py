"""v3 迁移：把 code_chunks 里的 class/function 拆到独立的 algorithms / functions 表。

运行方式：
    .venv/bin/python migrate_v3.py

前提：
    - code_chunks 表已完成 class_id 自引用回填（即 method 的 class_id 已指向其 class 行）。

步骤：
    1. 清空目标表 algorithms / functions（幂等，可重跑）。
    2. 把 chunk_type='class' 的行迁入 algorithms。
    3. 把 chunk_type in ('function','method') 的行迁入 functions，并把 class_id 从旧 code_chunks.id
       映射到新 algorithms.id（通过字典）。
"""
import db


def main():
    conn = db.get_conn()
    cur = conn.cursor()

    # 幂等：先清空目标表
    cur.execute("SET FOREIGN_KEY_CHECKS=0")
    cur.execute("TRUNCATE TABLE functions")
    cur.execute("TRUNCATE TABLE algorithms")
    cur.execute("SET FOREIGN_KEY_CHECKS=1")

    # 1. 迁移 class → algorithms
    cur.execute(
        "SELECT id,file_id,entity_name,module,family,task,math_methods,params,`references`,"
        "docstring_math,complexity,ref_edges,call_edges,start_line,end_line,"
        "code_text,embedding_text,embedding_json,chunk_metadata "
        "FROM code_chunks WHERE chunk_type='class' ORDER BY id"
    )
    alg_cols = [
        "id", "file_id", "entity_name", "module", "family", "task", "math_methods", "params",
        "references", "docstring_math", "complexity", "ref_edges", "call_edges", "start_line",
        "end_line", "code_text", "embedding_text", "embedding_json", "chunk_metadata",
    ]
    old_to_new_alg = {}
    for row in cur.fetchall():
        data = dict(zip(alg_cols, row))
        cur.execute(
            "INSERT INTO algorithms(file_id,name,module,family,task,math_methods,params,"
            "`references`,docstring_math,complexity,ref_edges,call_edges,"
            "start_line,end_line,code_text,embedding_text,embedding_json,chunk_metadata) "
            "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (data["file_id"], data["entity_name"], data["module"], data["family"], data["task"],
             data["math_methods"], data["params"], data["references"], data["docstring_math"],
             data["complexity"], data["ref_edges"], data["call_edges"], data["start_line"],
             data["end_line"], data["code_text"], data["embedding_text"], data["embedding_json"],
             data["chunk_metadata"]),
        )
        old_to_new_alg[data["id"]] = cur.lastrowid

    # 2. 迁移 function/method → functions，并重新映射 class_id
    cur.execute(
        "SELECT id,file_id,class_id,entity_name,parent_class,module,family,task,math_methods,params,"
        "`references`,docstring_math,complexity,ref_edges,call_edges,start_line,end_line,"
        "code_text,embedding_text,embedding_json,chunk_metadata "
        "FROM code_chunks WHERE chunk_type IN ('function','method') ORDER BY id"
    )
    fn_cols = [
        "id", "file_id", "class_id", "entity_name", "parent_class", "module", "family", "task",
        "math_methods", "params", "references", "docstring_math", "complexity", "ref_edges",
        "call_edges", "start_line", "end_line", "code_text", "embedding_text", "embedding_json",
        "chunk_metadata",
    ]
    for row in cur.fetchall():
        data = dict(zip(fn_cols, row))
        new_class_id = old_to_new_alg.get(data["class_id"]) if data["class_id"] else None
        cur.execute(
            "INSERT INTO functions(file_id,class_id,name,parent_class,module,family,task,math_methods,params,"
            "`references`,docstring_math,complexity,ref_edges,call_edges,"
            "start_line,end_line,code_text,embedding_text,embedding_json,chunk_metadata) "
            "VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
            (data["file_id"], new_class_id, data["entity_name"], data["parent_class"],
             data["module"], data["family"], data["task"], data["math_methods"], data["params"],
             data["references"], data["docstring_math"], data["complexity"], data["ref_edges"],
             data["call_edges"], data["start_line"], data["end_line"], data["code_text"],
             data["embedding_text"], data["embedding_json"], data["chunk_metadata"]),
        )

    conn.close()

    print(f"migrated {len(old_to_new_alg)} classes into algorithms")
    print("done; functions migrated as well")


if __name__ == "__main__":
    main()
