"""Back up and atomically rebuild all SQLite vectors without reparsing source."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import sqlite3
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from backend import db, parser
from backend.embedding_index import write_metadata


def rebuild(database, batch_size=32):
    database = Path(database).resolve()
    if not database.is_file():
        raise ValueError(f"Database does not exist: {database}")
    config = parser.embedding_config()
    if config["backend"] == "hash":
        raise ValueError("Formal reindex requires EMBEDDING_BACKEND=local or api, not hash")
    if batch_size < 1:
        raise ValueError("batch_size must be positive")
    backup_dir = database.parent / "backups"
    backup_dir.mkdir(exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup = backup_dir / f"{database.stem}-before-semantic-{timestamp}.sqlite3"
    conn = sqlite3.connect(database, timeout=60)
    try:
        with sqlite3.connect(backup) as backup_conn:
            conn.backup(backup_conn)
        print(f"Backup: {backup}", flush=True)
        conn.execute("BEGIN IMMEDIATE")
        jobs = []
        for identity, name, family, aliases, readme in conn.execute(
                "SELECT id,name,family,aliases,readme FROM modules ORDER BY id"):
            aliases = json.loads(aliases) if aliases else []
            text = parser.module_embed_text(name, family, aliases, readme)
            jobs.append(("modules", "readme_embedding", identity, text))
        counts = {"modules": len(jobs)}
        for table in ("algorithms", "functions"):
            rows = conn.execute(f"SELECT id,embedding_text FROM {table} ORDER BY id").fetchall()
            counts[table] = len(rows)
            jobs.extend((table, "embedding_json", identity, text) for identity, text in rows)
        if not jobs or any(not str(job[3] or "").strip() for job in jobs):
            raise ValueError("Index is empty or contains missing embedding text; no changes made")
        dimension = None
        for start in range(0, len(jobs), batch_size):
            batch = jobs[start:start + batch_size]
            vectors = parser.embed_many([job[3] for job in batch], batch_size=batch_size)
            if len(vectors) != len(batch):
                raise ValueError("Model returned the wrong number of embeddings")
            for (table, column, identity, _), vector in zip(batch, vectors):
                vector = parser.normalize_vector(vector)
                if dimension is None:
                    dimension = len(vector)
                if len(vector) != dimension:
                    raise ValueError("Inconsistent embedding dimensions")
                conn.execute(f"UPDATE {table} SET {column}=? WHERE id=?",
                             (json.dumps(vector), identity))
            print(f"Embedded {min(start + batch_size, len(jobs))}/{len(jobs)}", flush=True)
        if config != parser.embedding_config():
            raise ValueError("Embedding configuration changed during migration")
        metadata = {"config": config, "dimension": dimension, "counts": counts,
                    "rebuilt_at": datetime.now(timezone.utc).isoformat()}
        write_metadata(conn, metadata)
        conn.commit()
        print(json.dumps(metadata, ensure_ascii=False, indent=2), flush=True)
        return metadata, backup
    except BaseException:
        conn.rollback()
        raise
    finally:
        conn.close()


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument("--database", default=db.SQLITE_PATH)
    args.add_argument("--batch-size", type=int, default=32)
    options = args.parse_args()
    if not db.is_sqlite():
        args.error("This migration supports SQLite only; it does not modify MySQL")
    rebuild(options.database, options.batch_size)


if __name__ == "__main__":
    main()
