"""SQLite embedding identity checks shared by indexing and retrieval."""
import json
import sqlite3

from backend import db, parser


class EmbeddingIndexError(RuntimeError):
    pass


def read_metadata(conn):
    exists = conn.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name='embedding_index'"
    ).fetchone()
    if not exists:
        return None
    row = conn.execute("SELECT metadata FROM embedding_index WHERE id=1").fetchone()
    return json.loads(row[0]) if row else None


def write_metadata(conn, metadata):
    conn.execute("CREATE TABLE IF NOT EXISTS embedding_index "
                 "(id INTEGER PRIMARY KEY CHECK(id=1), metadata TEXT NOT NULL)")
    conn.execute("INSERT OR REPLACE INTO embedding_index(id,metadata) VALUES(1,?)",
                 (json.dumps(metadata, ensure_ascii=False),))


def ensure_compatible():
    if not db.is_sqlite():
        return
    with sqlite3.connect(db.SQLITE_PATH) as conn:
        metadata = read_metadata(conn)
        if metadata is None:
            populated = any(conn.execute(f"SELECT 1 FROM {table} LIMIT 1").fetchone()
                            for table in ("modules", "algorithms", "functions"))
            if not populated:
                return
            raise EmbeddingIndexError(
                "索引缺少模型记录。请运行 scripts/reembed_all.py 全量重建向量索引。")
        if metadata.get("config") != parser.embedding_config():
            raise EmbeddingIndexError(
                "查询模型与索引模型不一致。请恢复模型配置，或运行 scripts/reembed_all.py 全量重建索引。")
        return metadata


def embed_query(text):
    metadata = ensure_compatible()
    vector = parser.embed(text)
    if metadata and len(vector) != metadata.get("dimension"):
        raise EmbeddingIndexError("查询向量维度与索引不一致，请检查模型配置并全量重建索引。")
    return vector


def prepare_for_indexing():
    ensure_compatible()
    if not db.is_sqlite():
        return
    with sqlite3.connect(db.SQLITE_PATH) as conn:
        if read_metadata(conn) is None:
            vector = parser.embed("embedding dimension check")
            write_metadata(conn, {"config": parser.embedding_config(), "dimension": len(vector)})
