#!/usr/bin/env bash
# 一键部署：建虚拟环境 → 装依赖 → 建库 → 恢复/重建数据 → 启动后端
# 用法（在仓库根目录执行）：bash scripts/deploy.sh
set -e
cd "$(dirname "$0")/.."   # 切到仓库根目录

# 载入 .env（MySQL/Embedding 配置），没有就忽略
if [ -f .env ]; then set -a; . ./.env; set +a; fi

echo "==> 1/5 创建虚拟环境"
if [ ! -d .venv ]; then python3 -m venv .venv; fi
# shellcheck disable=SC1091
. .venv/bin/activate

echo "==> 2/5 安装依赖（首次含 torch，可能较慢）"
pip install -q -r requirements.txt

echo "==> 3/5 初始化数据库表结构"
python -c "from backend import db; db.init_db(); print('schema ready')"

echo "==> 4/5 准备数据"
if [ -f data/code_x_ray.sql ]; then
  MYSQL_BIN="/Applications/XAMPP/xamppfiles/bin"
  CLI="$MYSQL_BIN/mysql"; command -v mysql >/dev/null 2>&1 && CLI="mysql"
  HOST="${MYSQL_HOST:-127.0.0.1}"; USER="${MYSQL_USER:-root}"; PORT="${MYSQL_PORT:-3306}"
  if [ -n "${MYSQL_PASSWORD:-}" ]; then P="-p${MYSQL_PASSWORD}"; else P=""; fi
  echo "    恢复 dump：data/code_x_ray.sql"
  "$CLI" -h "$HOST" -u "$USER" $P -P "$PORT" code_x_ray < data/code_x_ray.sql
else
  echo "    无 dump，从 numpy-ml 重新导入（需联网，会下载 embedding 模型，稍慢）"
  python -c "from backend import index_pipeline; print(index_pipeline.index_repo())"
fi

echo "==> 5/5 启动后端（http://127.0.0.1:8000）"
exec uvicorn backend.app:app --host 0.0.0.0 --port 8000
