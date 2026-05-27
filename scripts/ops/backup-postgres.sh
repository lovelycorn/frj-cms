#!/usr/bin/env bash
set -euo pipefail

OUTPUT_DIR="${1:-./backups}"
mkdir -p "${OUTPUT_DIR}"

STAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="${OUTPUT_DIR}/frjcms-${STAMP}.sql"

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

echo "Creating backup: ${OUTPUT_FILE}"
docker compose --env-file "${COMPOSE_ENV_FILE}" -f "${COMPOSE_FILE_PATH}" exec -T postgres pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "${OUTPUT_FILE}"
echo "Backup completed: ${OUTPUT_FILE}"
