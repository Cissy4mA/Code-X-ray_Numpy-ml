#!/usr/bin/env bash
# One-click deploy: create venv -> install deps -> init DB -> restore/rebuild data -> start backend
# Usage (from repo root): bash scripts/deploy.sh
set -e
cd "$(dirname "$0")/.."   # switch to repo root

# Load .env (MySQL/Embedding config); ignore if absent
if [ -f .env ]; then set -a; . ./.env; set +a; fi

echo "==> 1/5 Creating virtual environment"
if [ ! -d .venv ]; then python3 -m venv .venv; fi
# shellcheck disable=SC1091
. .venv/bin/activate

echo "==> 2/5 Installing dependencies (first run includes torch, may be slow)"
python -m pip --version >/dev/null 2>&1 || python -m ensurepip --upgrade
python -m pip install -q -r requirements.txt

echo "==> 3/5 Initializing database tables"
python -c "from backend import db; db.init_db(); print('schema ready')"

echo "==> 4/5 Preparing data"
if [ "${DB_BACKEND:-sqlite}" = "sqlite" ] && [ -f "${SQLITE_PATH:-data/code_x_ray.sqlite3}" ]; then
    echo "    SQLite database already exists: ${SQLITE_PATH:-data/code_x_ray.sqlite3}, skipping re-import"
elif [ -f data/code_x_ray.sql ]; then
  MYSQL_BIN="/Applications/XAMPP/xamppfiles/bin"
  CLI="$MYSQL_BIN/mysql"; command -v mysql >/dev/null 2>&1 && CLI="mysql"
  HOST="${MYSQL_HOST:-127.0.0.1}"; USER="${MYSQL_USER:-root}"; PORT="${MYSQL_PORT:-3306}"
  if [ -n "${MYSQL_PASSWORD:-}" ]; then P="-p${MYSQL_PASSWORD}"; else P=""; fi
    echo "    Restoring dump: data/code_x_ray.sql"
  "$CLI" -h "$HOST" -u "$USER" $P -P "$PORT" code_x_ray < data/code_x_ray.sql
else
    echo "    No dump found, re-importing from numpy-ml (needs network, downloads embedding model, slow)"
  python -c "from backend import index_pipeline; print(index_pipeline.index_repo())"
fi

echo "==> 5/5 Starting website (port ${PORT:-8000})"
exec python -m uvicorn backend.app:app --host 0.0.0.0 --port "${PORT:-8000}"
