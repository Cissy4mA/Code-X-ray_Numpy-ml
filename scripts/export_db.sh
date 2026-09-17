#!/usr/bin/env bash
# 导出 code_x_ray 数据库为 data/code_x_ray.sql（给队友恢复用，秒级起库）
# 用法：bash scripts/export_db.sh   （需本机 MySQL 在运行）
set -e
if [ -f .env ]; then set -a; . ./.env; set +a; fi

MYSQL_BIN="/Applications/XAMPP/xamppfiles/bin"
DUMP="$MYSQL_BIN/mysqldump"; command -v mysqldump >/dev/null 2>&1 && DUMP="mysqldump"
[ -x "$DUMP" ] || { echo "找不到 mysqldump，请确认 XAMPP 已安装或在 PATH 中"; exit 1; }

HOST="${MYSQL_HOST:-127.0.0.1}"; USER="${MYSQL_USER:-root}"; PORT="${MYSQL_PORT:-3306}"
if [ -n "${MYSQL_PASSWORD:-}" ]; then P="-p${MYSQL_PASSWORD}"; else P=""; fi

mkdir -p data
"$DUMP" -h "$HOST" -u "$USER" $P -P "$PORT" --default-character-set=utf8mb4 --single-transaction code_x_ray > data/code_x_ray.sql
echo "✅ 导出完成：data/code_x_ray.sql"
