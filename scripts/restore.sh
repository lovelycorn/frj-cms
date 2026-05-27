#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "[ERROR] Usage: $0 <backup-file.sql>" >&2
  exit 1
fi

BACKUP_FILE="$1"
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"
POSTGRES_SERVICE="${POSTGRES_SERVICE:-postgres}"
POSTGRES_USER="${POSTGRES_USER:-strapi}"
POSTGRES_DB="${POSTGRES_DB:-frjcms}"

[[ -f "${BACKUP_FILE}" ]] || { echo "[ERROR] Backup file not found: ${BACKUP_FILE}" >&2; exit 1; }

cd "${PROJECT_DIR}"
cat "${BACKUP_FILE}" | docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" exec -T "${POSTGRES_SERVICE}" \
  psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"

echo "[SUCCESS] Restore completed from ${BACKUP_FILE}"
