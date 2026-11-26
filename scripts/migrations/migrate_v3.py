"""v3 migration: split class/function chunks in code_chunks into separate algorithms / functions tables.

How to run:
    .venv/bin/python migrate_v3.py

Prerequisites:
        - The code_chunks table has completed the class_id self-reference backfill (i.e. method class_id points to its class row).

Steps:
        1. Clear target tables algorithms / functions (idempotent, safe to re-run).
        2. Migrate rows with chunk_type='class' into algorithms.
        3. Migrate rows with chunk_type in ('function','method') into functions, and remap class_id from the old code_chunks.id
              to the new algorithms.id (via a dictionary).
"""
import db


def main():
    conn = db.get_conn()
    cur = conn.cursor()

        # Idempotent: clear target tables first
    cur.execute("SET FOREIGN_KEY_CHECKS=0")
    cur.execute("TRUNCATE TABLE functions")
    cur.execute("TRUNCATE TABLE algorithms")
    cur.execute("SET FOREIGN_KEY_CHECKS=1")

        # 1. Migrate class -> algorithms
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

        # 2. Migrate function/method -> functions, and remap class_id
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
