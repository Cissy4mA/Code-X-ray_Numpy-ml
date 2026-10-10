"""Database connection and schema setup.

Default is SQLite for local demos. Set DB_BACKEND=mysql to use the original
XAMPP/MySQL setup.
"""
import os
import re
import sqlite3

import pymysql


REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.environ.get("DB_BACKEND", "sqlite").lower()

# MySQL defaults target local XAMPP.
HOST = os.environ.get("MYSQL_HOST", "127.0.0.1")
USER = os.environ.get("MYSQL_USER", "root")
PASSWORD = os.environ.get("MYSQL_PASSWORD", "")
PORT = int(os.environ.get("MYSQL_PORT", "3306"))
DB = os.environ.get("MYSQL_DB", "code_x_ray")

SQLITE_PATH = os.environ.get(
    "SQLITE_PATH",
    os.path.join(REPO_ROOT, "data", "code_x_ray.sqlite3"),
)


def is_sqlite():
    return BACKEND == "sqlite"


class CompatCursor:
    """Small MySQL-to-SQLite adapter for this app's limited SQL usage."""

    def __init__(self, cur):
        self.cur = cur
        self._lastrowid = None

    @property
    def lastrowid(self):
        return self.cur.lastrowid

    def execute(self, sql, params=None):
        params = list(params or [])
        if is_sqlite():
            sql, params = _sqlite_sql(sql, params)
        res = self.cur.execute(sql, params)
        if is_sqlite():
            self.cur.connection.commit()
        self._lastrowid = self.cur.lastrowid
        return res

    def fetchone(self):
        return self.cur.fetchone()

    def fetchall(self):
        return self.cur.fetchall()


class CompatConn:
    def __init__(self, conn):
        self.conn = conn

    def cursor(self):
        return CompatCursor(self.conn.cursor())

    def close(self):
        self.conn.close()


def _expand_in_params(sql, params):
    """Expand one %s placeholder when its param is a tuple/list for IN clauses."""
    out_params = []
    for p in params:
        if isinstance(p, (tuple, list, set)):
            values = list(p)
            placeholders = ",".join(["?"] * len(values)) or "NULL"
            sql = sql.replace("%s", f"({placeholders})", 1)
            out_params.extend(values)
        else:
            sql = sql.replace("%s", "?", 1)
            out_params.append(p)
    return sql, out_params


def _keyword_score_expr(query):
    terms = [t.lower() for t in re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", query or "") if len(t) > 1]
    if not terms:
        return 0.0
    return float(len(terms))


def _sqlite_sql(sql, params):
    stripped = sql.strip()
    upper = stripped.upper()

    if upper.startswith("SET FOREIGN_KEY_CHECKS"):
        return "SELECT 1", []
    if upper.startswith("TRUNCATE TABLE"):
        table = stripped.split()[-1]
        return f"DELETE FROM {table}", []

    sql = sql.replace("`references`", "refs")
    sql = re.sub(r"MATCH\(code_text,name,embedding_text\) AGAINST\(%s IN BOOLEAN MODE\)", "?", sql)
    if "MATCH(code_text,name,embedding_text)" in sql:
        # Should be handled above, but keep a defensive fallback.
        sql = re.sub(r"MATCH\(code_text,name,embedding_text\).*?AS kw", "? AS kw", sql)

    if " AS kw" in sql and params:
        params = [_keyword_score_expr(params[0])] + list(params[1:])

    sql, params = _expand_in_params(sql, params)
    return sql, params


def get_conn():
    if is_sqlite():
        os.makedirs(os.path.dirname(SQLITE_PATH), exist_ok=True)
        conn = sqlite3.connect(SQLITE_PATH)
        conn.execute("PRAGMA foreign_keys=ON")
        return CompatConn(conn)
    return pymysql.connect(
        host=HOST, user=USER, password=PASSWORD, port=PORT, database=DB,
        charset="utf8mb4", autocommit=True,
    )


def _mysql_init_db():
    c = pymysql.connect(host=HOST, user=USER, password=PASSWORD, port=PORT, charset="utf8mb4")
    try:
        c.cursor().execute(f"CREATE DATABASE IF NOT EXISTS `{DB}` CHARACTER SET utf8mb4")
    finally:
        c.close()

    conn = get_conn()
    try:
        cur = conn.cursor()
        for t in _MYSQL_TABLES:
            cur.execute(t)
        for m in _MYSQL_MIGRATIONS:
            try:
                cur.execute(m)
            except Exception:
                pass
    finally:
        conn.close()


def _sqlite_init_db():
    conn = sqlite3.connect(SQLITE_PATH)
    try:
        conn.execute("PRAGMA foreign_keys=ON")
        cur = conn.cursor()
        for t in _SQLITE_TABLES:
            cur.execute(t)
        conn.commit()
    finally:
        conn.close()


def init_db():
    if is_sqlite():
        _sqlite_init_db()
    else:
        _mysql_init_db()


_SQLITE_TABLES = [
    """CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""",
    """CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        family TEXT,
        task TEXT,
        description TEXT,
        readme TEXT,
        aliases TEXT,
        readme_embedding TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, name)
    )""",
    """CREATE TABLE IF NOT EXISTS code_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        module_id INTEGER,
        path TEXT NOT NULL,
        module TEXT,
        language TEXT DEFAULT 'python',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""",
    """CREATE TABLE IF NOT EXISTS algorithms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        name TEXT,
        module TEXT,
        family TEXT,
        task TEXT,
        math_methods TEXT,
        params TEXT,
        refs TEXT,
        docstring_math TEXT,
        complexity REAL,
        ref_edges TEXT,
        call_edges TEXT,
        start_line INTEGER,
        end_line INTEGER,
        code_text TEXT NOT NULL,
        embedding_text TEXT,
        embedding_json TEXT,
        chunk_metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE
    )""",
    """CREATE TABLE IF NOT EXISTS functions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        file_id INTEGER NOT NULL,
        class_id INTEGER,
        name TEXT,
        parent_class TEXT,
        module TEXT,
        family TEXT,
        task TEXT,
        math_methods TEXT,
        params TEXT,
        refs TEXT,
        docstring_math TEXT,
        complexity REAL,
        ref_edges TEXT,
        call_edges TEXT,
        start_line INTEGER,
        end_line INTEGER,
        code_text TEXT NOT NULL,
        embedding_text TEXT,
        embedding_json TEXT,
        chunk_metadata TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES algorithms(id) ON DELETE CASCADE
    )""",
]


_MYSQL_TABLES = [
    """CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        name VARCHAR(128) NOT NULL,
        family VARCHAR(128),
        task VARCHAR(64),
        description TEXT,
        readme TEXT,
        aliases TEXT,
        readme_embedding TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uk_module_name (project_id, name),
        INDEX idx_modules_project (project_id)
    ) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS code_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        module_id INT,
        path VARCHAR(512) NOT NULL,
        module VARCHAR(128),
        language VARCHAR(32) DEFAULT 'python',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_files_project (project_id),
        INDEX idx_files_module (module_id)
    ) ENGINE=InnoDB""",
    """CREATE TABLE IF NOT EXISTS algorithms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        name VARCHAR(255),
        module VARCHAR(128),
        family VARCHAR(128),
        task VARCHAR(64),
        math_methods TEXT,
        params TEXT,
        `references` TEXT,
        docstring_math TEXT,
        complexity FLOAT,
        ref_edges JSON,
        call_edges JSON,
        start_line INT,
        end_line INT,
        code_text TEXT NOT NULL,
        embedding_text TEXT,
        embedding_json TEXT,
        chunk_metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FULLTEXT INDEX ft_alg (code_text, name, embedding_text),
        INDEX idx_alg_file (file_id),
        INDEX idx_alg_module (module),
        INDEX idx_alg_family (family),
        INDEX idx_alg_task (task),
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
    """CREATE TABLE IF NOT EXISTS functions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_id INT NOT NULL,
        class_id INT,
        name VARCHAR(255),
        parent_class VARCHAR(255),
        module VARCHAR(128),
        family VARCHAR(128),
        task VARCHAR(64),
        math_methods TEXT,
        params TEXT,
        `references` TEXT,
        docstring_math TEXT,
        complexity FLOAT,
        ref_edges JSON,
        call_edges JSON,
        start_line INT,
        end_line INT,
        code_text TEXT NOT NULL,
        embedding_text TEXT,
        embedding_json TEXT,
        chunk_metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FULLTEXT INDEX ft_fn (code_text, name, embedding_text),
        INDEX idx_fn_file (file_id),
        INDEX idx_fn_class (class_id),
        INDEX idx_fn_module (module),
        INDEX idx_fn_family (family),
        INDEX idx_fn_task (task),
        FOREIGN KEY (file_id) REFERENCES code_files(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES algorithms(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4""",
]

_MYSQL_MIGRATIONS = [
    "DROP TABLE IF EXISTS code_chunks",
    "ALTER TABLE modules ADD COLUMN IF NOT EXISTS readme TEXT",
    "ALTER TABLE modules ADD COLUMN IF NOT EXISTS aliases TEXT",
    "ALTER TABLE modules ADD COLUMN IF NOT EXISTS readme_embedding TEXT",
    "ALTER TABLE code_files ADD COLUMN IF NOT EXISTS module VARCHAR(128)",
    "ALTER TABLE code_files ADD COLUMN IF NOT EXISTS module_id INT",
]
