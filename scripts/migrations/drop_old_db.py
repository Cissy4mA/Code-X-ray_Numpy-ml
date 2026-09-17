"""Drop the legacy code_rag_mini database after migration to code_x_ray."""
import pymysql

HOST = "127.0.0.1"
USER = "root"
PASSWORD = ""
PORT = 3306
OLD_DB = "code_rag_mini"

conn = pymysql.connect(host=HOST, user=USER, password=PASSWORD, port=PORT, charset="utf8mb4")
try:
    cur = conn.cursor()
    cur.execute(f"DROP DATABASE IF EXISTS `{OLD_DB}`")
    print(f"Dropped database `{OLD_DB}`.")
finally:
    conn.close()
