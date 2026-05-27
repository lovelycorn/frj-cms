#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"
OUTPUT_DIR="${1:-./backups}"
POSTGRES_SERVICE="${POSTGRES_SERVICE:-postgres}"
POSTGRES_USER="${POSTGRES_USER:-strapi}"
POSTGRES_DB="${POSTGRES_DB:-frjcms}"

mkdir -p "${OUTPUT_DIR}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="${OUTPUT_DIR}/frjcms-${STAMP}.sql"

cd "${PROJECT_DIR}"

docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${POSTGRES_SERVICE}" \
  pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "${OUTPUT_FILE}"

echo "[SUCCESS] Backup completed: ${OUTPUT_FILE}"
