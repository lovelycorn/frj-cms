#!/usr/bin/env bash
set -euo pipefail

PUBLIC_IP="${PUBLIC_IP:-165.154.163.41}"
FRONTEND_PORT="${FRONTEND_PORT:-18080}"
CMS_PORT="${CMS_PORT:-10086}"
SITE_CODE="${SITE_CODE:-us}"
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"
STRAPI_ADMIN_EMAIL="${STRAPI_ADMIN_EMAIL:-admin@frj-cms.local}"
STRAPI_ADMIN_PASSWORD="${STRAPI_ADMIN_PASSWORD:-}"
POSTGRES_DB="${POSTGRES_DB:-frjcms}"
POSTGRES_USER="${POSTGRES_USER:-strapi}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-}"
NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmjs.org}"
NODE_IMAGE="${NODE_IMAGE:-node:20-bookworm-slim}"
POSTGRES_IMAGE="${POSTGRES_IMAGE:-postgres:16-alpine}"
OVERWRITE_ENV="${OVERWRITE_ENV:-true}"
RUN_SMOKE_CHECK="${RUN_SMOKE_CHECK:-true}"

timestamp() {
  date +"%Y%m%d-%H%M%S"
}

log() {
  printf "[deploy] %s\n" "$1"
}

gen_secret() {
  openssl rand -hex 32
}

ensure_value() {
  local value="$1"
  if [[ -n "${value}" ]]; then
    printf "%s" "${value}"
  else
    gen_secret
  fi
}

docker_cmd() {
  if docker ps >/dev/null 2>&1; then
    echo "docker"
    return
  fi

  if sudo docker ps >/dev/null 2>&1; then
    echo "sudo docker"
    return
  fi

  echo "Docker is not usable by current user. Run scripts/ops/setup-server-ip.sh first." >&2
  exit 1
}

write_env_file() {
  local env_path="$1"
  local app_keys="$2"
  local api_token_salt="$3"
  local admin_jwt_secret="$4"
  local transfer_token_salt="$5"
  local jwt_secret="$6"
  local encryption_key="$7"
  local admin_password="$8"
  local db_password="$9"

  cat > "${env_path}" <<EOF
NODE_ENV=production
SITE_CODE=${SITE_CODE}

APP_URL=http://${PUBLIC_IP}:${FRONTEND_PORT}
NEXT_PUBLIC_API_URL=http://${PUBLIC_IP}:${CMS_PORT}
STRAPI_PUBLIC_URL=http://${PUBLIC_IP}:${CMS_PORT}
STRAPI_URL=http://strapi-prod:1337

NODE_IMAGE=${NODE_IMAGE}
POSTGRES_IMAGE=${POSTGRES_IMAGE}
NPM_REGISTRY=${NPM_REGISTRY}

NEXT_BIND_ADDR=0.0.0.0
STRAPI_BIND_ADDR=0.0.0.0
POSTGRES_BIND_ADDR=127.0.0.1
NEXT_PORT=${FRONTEND_PORT}
STRAPI_PORT=${CMS_PORT}
POSTGRES_PORT=5432

POSTGRES_DB=${POSTGRES_DB}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${db_password}

DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=${POSTGRES_DB}
DATABASE_USERNAME=${POSTGRES_USER}
DATABASE_PASSWORD=${db_password}
DATABASE_SSL=false
DATABASE_URL=postgresql://${POSTGRES_USER}:${db_password}@postgres:5432/${POSTGRES_DB}

APP_KEYS=${app_keys}
API_TOKEN_SALT=${api_token_salt}
ADMIN_JWT_SECRET=${admin_jwt_secret}
TRANSFER_TOKEN_SALT=${transfer_token_salt}
JWT_SECRET=${jwt_secret}
ENCRYPTION_KEY=${encryption_key}

STRAPI_ADMIN_EMAIL=${STRAPI_ADMIN_EMAIL}
STRAPI_ADMIN_PASSWORD=${admin_password}
EOF
}

main() {
  cd "${PROJECT_DIR}"

  if [[ ! -f "${COMPOSE_FILE}" ]]; then
    echo "Compose file not found: ${PROJECT_DIR}/${COMPOSE_FILE}" >&2
    exit 1
  fi

  local dc
  dc="$(docker_cmd)"

  if [[ -f "${ENV_FILE}" && "${OVERWRITE_ENV}" != "true" ]]; then
    echo "${ENV_FILE} exists and OVERWRITE_ENV!=true, abort." >&2
    exit 1
  fi

  if [[ -f "${ENV_FILE}" ]]; then
    local backup="${ENV_FILE}.bak.$(timestamp)"
    cp "${ENV_FILE}" "${backup}"
    log "Backed up existing ${ENV_FILE} to ${backup}"
  fi

  local admin_password db_password app_key_1 app_key_2 app_key_3 app_key_4
  local api_token_salt admin_jwt_secret transfer_token_salt jwt_secret encryption_key

  admin_password="$(ensure_value "${STRAPI_ADMIN_PASSWORD}")"
  db_password="$(ensure_value "${POSTGRES_PASSWORD}")"
  app_key_1="$(gen_secret)"
  app_key_2="$(gen_secret)"
  app_key_3="$(gen_secret)"
  app_key_4="$(gen_secret)"
  api_token_salt="$(gen_secret)"
  admin_jwt_secret="$(gen_secret)"
  transfer_token_salt="$(gen_secret)"
  jwt_secret="$(gen_secret)"
  encryption_key="$(gen_secret)"

  write_env_file \
    "${ENV_FILE}" \
    "${app_key_1},${app_key_2},${app_key_3},${app_key_4}" \
    "${api_token_salt}" \
    "${admin_jwt_secret}" \
    "${transfer_token_salt}" \
    "${jwt_secret}" \
    "${encryption_key}" \
    "${admin_password}" \
    "${db_password}"

  chmod 600 "${ENV_FILE}"
  log "Generated ${ENV_FILE} for IP+port deployment."

  local creds_file="production-generated-credentials.$(timestamp).txt"
  cat > "${creds_file}" <<EOF
APP_URL=http://${PUBLIC_IP}:${FRONTEND_PORT}
STRAPI_URL=http://${PUBLIC_IP}:${CMS_PORT}
STRAPI_ADMIN_EMAIL=${STRAPI_ADMIN_EMAIL}
STRAPI_ADMIN_PASSWORD=${admin_password}
POSTGRES_DB=${POSTGRES_DB}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${db_password}
EOF
  chmod 600 "${creds_file}"
  log "Generated credentials snapshot: ${creds_file}"

  log "Pulling latest repo changes on current branch."
  git pull --ff-only

  log "Pruning Docker builder cache."
  ${dc} builder prune -af || true

  log "Building images without cache."
  ${dc} compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" build --no-cache

  log "Starting containers."
  ${dc} compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d
  ${dc} compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ps

  if [[ "${RUN_SMOKE_CHECK}" == "true" ]]; then
    log "Running smoke checks through public IP."
    FRONTEND_URL="http://${PUBLIC_IP}:${FRONTEND_PORT}" \
      STRAPI_URL="http://${PUBLIC_IP}:${CMS_PORT}" \
      ./scripts/smoke-check.sh
  fi

  log "Deployment finished."
}

main "$@"
