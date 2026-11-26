#!/usr/bin/env bash
# Daily start: assumes already deployed (venv + data ready), only starts the backend
# Usage (repo root): bash scripts/run.sh
set -e
cd "$(dirname "$0")/.."
if [ -f .env ]; then set -a; . ./.env; set +a; fi
# shellcheck disable=SC1091
. .venv/bin/activate
exec python -m uvicorn backend.app:app --host 0.0.0.0 --port "${PORT:-8000}"
