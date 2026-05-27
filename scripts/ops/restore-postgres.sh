#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup-file.sql>" >&2
  exit 1
fi

BACKUP_FILE="$1"

if [[ ! -f "${BACKUP_FILE}" ]]; then
  echo "Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

POSTGRES_USER="${POSTGRES_USER:-strapi}"
POSTGRES_DB="${POSTGRES_DB:-frjcms}"
COMPOSE_FILE_PATH="${COMPOSE_FILE:-docker-compose.prod.yml}"
COMPOSE_ENV_FILE="${COMPOSE_ENV_FILE:-.env.production}"

if [[ ! -f "${COMPOSE_FILE_PATH}" ]]; then
  echo "Compose file not found: ${COMPOSE_FILE_PATH}" >&2
  exit 1
fi

if [[ ! -f "${COMPOSE_ENV_FILE}" ]]; then
  echo "Compose env file not found: ${COMPOSE_ENV_FILE}" >&2
  exit 1
fi

echo "Restoring ${BACKUP_FILE} to database ${POSTGRES_DB}..."
cat "${BACKUP_FILE}" | docker compose --env-file "${COMPOSE_ENV_FILE}" -f "${COMPOSE_FILE_PATH}" exec -T postgres psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}"
echo "Restore completed."
