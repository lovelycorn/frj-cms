#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
MODE="${MODE:-prod}"

case "${MODE}" in
  dev)
    COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.dev.yml}"
    ENV_FILE="${ENV_FILE:-.env.development}"
    ;;
  prod)
    COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
    ENV_FILE="${ENV_FILE:-.env.production}"
    ;;
  *)
    echo "[ERROR] MODE must be dev or prod" >&2
    exit 1
    ;;
esac

cd "${PROJECT_DIR}"

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" logs -f "$@"
