#!/usr/bin/env bash
# 日常启动：假设已部署过（venv + 数据就绪），只拉起后端
# 用法（仓库根目录）：bash scripts/run.sh
set -e
cd "$(dirname "$0")/.."
if [ -f .env ]; then set -a; . ./.env; set +a; fi
# shellcheck disable=SC1091
. .venv/bin/activate
exec uvicorn backend.app:app --host 0.0.0.0 --port 8000
