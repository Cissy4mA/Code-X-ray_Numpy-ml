"""Rename MySQL database: code_rag_mini -> code_x_ray.

Because MySQL's RENAME DATABASE is deprecated/removed, we do a structure copy:
create new DB -> CREATE TABLE ... LIKE -> INSERT INTO ... SELECT * FROM old.
"""
import pymysql

HOST = "127.0.0.1"
USER = "root"
PASSWORD = ""
PORT = 3306
OLD_DB = "code_rag_mini"
NEW_DB = "code_x_ray"

TABLES = ["projects", "code_files", "code_chunks"]

conn = pymysql.connect(host=HOST, user=USER, password=PASSWORD, port=PORT, charset="utf8mb4")
try:
    cur = conn.cursor()
    cur.execute(f"CREATE DATABASE IF NOT EXISTS `{NEW_DB}` CHARACTER SET utf8mb4")
    for t in TABLES:
        cur.execute(f"DROP TABLE IF EXISTS `{NEW_DB}`.`{t}`")
        cur.execute(f"CREATE TABLE `{NEW_DB}`.`{t}` LIKE `{OLD_DB}`.`{t}`")
        cur.execute(f"INSERT INTO `{NEW_DB}`.`{t}` SELECT * FROM `{OLD_DB}`.`{t}`")
        cur.execute(f"SELECT COUNT(*) FROM `{NEW_DB}`.`{t}`")
        cnt = cur.fetchone()[0]
        print(f"{t}: {cnt} rows copied")
    conn.commit()
    print(f"Migration done. New database `{NEW_DB}` is ready with data from `{OLD_DB}`.")
finally:
    conn.close()
