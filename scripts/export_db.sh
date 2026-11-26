#!/usr/bin/env bash
# Export the code_x_ray database to data/code_x_ray.sql (for teammates to restore, fast DB startup)
# Usage: bash scripts/export_db.sh   (requires local MySQL running)
set -e
if [ -f .env ]; then set -a; . ./.env; set +a; fi

MYSQL_BIN="/Applications/XAMPP/xamppfiles/bin"
DUMP="$MYSQL_BIN/mysqldump"; command -v mysqldump >/dev/null 2>&1 && DUMP="mysqldump"
[ -x "$DUMP" ] || { echo "mysqldump not found; please confirm XAMPP is installed or on PATH"; exit 1; }

HOST="${MYSQL_HOST:-127.0.0.1}"; USER="${MYSQL_USER:-root}"; PORT="${MYSQL_PORT:-3306}"
if [ -n "${MYSQL_PASSWORD:-}" ]; then P="-p${MYSQL_PASSWORD}"; else P=""; fi

mkdir -p data
"$DUMP" -h "$HOST" -u "$USER" $P -P "$PORT" --default-character-set=utf8mb4 --single-transaction code_x_ray > data/code_x_ray.sql
echo "✅ Export complete: data/code_x_ray.sql"
