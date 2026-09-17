import db
import parser

conn = db.get_conn()
cur = conn.cursor()

for mod in sorted(parser.NON_ALGO_MODULES):
    cur.execute("DELETE FROM modules WHERE name=%s", (mod,))
    print(f"deleted module row '{mod}': rows={cur.rowcount}")
    cur.execute("DELETE FROM code_files WHERE module=%s", (mod,))
    print(f"deleted loose files in '{mod}': rows={cur.rowcount}")

conn.close()
print("cleanup done")
