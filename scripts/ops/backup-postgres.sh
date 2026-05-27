#!/usr/bin/env bash
set -euo pipefail

OUTPUT_DIR="${1:-./backups}"
mkdir -p "${OUTPUT_DIR}"

STAMP="$(date +%Y%m%d-%H%M%S)"
OUTPUT_FILE="${OUTPUT_DIR}/frjcms-${STAMP}.sql"

POSTGRES_USER="${POSTGRES_USER:-strapi}"
POSTGRES_DB="${POSTGRES_DB:-frjcms}"

echo "Creating backup: ${OUTPUT_FILE}"
docker compose exec -T postgres pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "${OUTPUT_FILE}"
echo "Backup completed: ${OUTPUT_FILE}"
