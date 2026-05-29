#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"
SKIP_GIT_PULL="${SKIP_GIT_PULL:-0}"
SKIP_BUILD="${SKIP_BUILD:-0}"
SMOKE_CHECK="${SMOKE_CHECK:-1}"
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-240}"

if [[ -t 1 ]]; then
  C_INFO='\033[1;34m'
  C_STEP='\033[1;36m'
  C_SUCCESS='\033[1;32m'
  C_WARN='\033[1;33m'
  C_ERROR='\033[1;31m'
  C_RESET='\033[0m'
else
  C_INFO=''
  C_STEP=''
  C_SUCCESS=''
  C_WARN=''
  C_ERROR=''
  C_RESET=''
fi

log_info() { printf "%b[INFO]%b %s\n" "${C_INFO}" "${C_RESET}" "$1"; }
log_step() { printf "%b[STEP]%b %s\n" "${C_STEP}" "${C_RESET}" "$1"; }
log_success() { printf "%b[SUCCESS]%b %s\n" "${C_SUCCESS}" "${C_RESET}" "$1"; }
log_warn() { printf "%b[WARN]%b %s\n" "${C_WARN}" "${C_RESET}" "$1"; }
log_error() { printf "%b[ERROR]%b %s\n" "${C_ERROR}" "${C_RESET}" "$1" >&2; }

fail() {
  log_error "$1"
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

require_nonempty_env_key() {
  local key="$1"
  local val
  val="$(load_env_value "${key}" || true)"
  [[ -n "${val}" ]] || fail "Required env key is missing or empty: ${key}"
}

require_secret_env_key() {
  local key="$1"
  local val
  val="$(load_env_value "${key}" || true)"
  [[ -n "${val}" ]] || fail "Required secret key is missing or empty: ${key}"
  [[ "${val}" == *"changeMe"* ]] && fail "Secret key still uses placeholder value: ${key}"
}

load_env_value() {
  local key="$1"
  if [[ ! -f "${ENV_FILE}" ]]; then
    return 1
  fi
  awk -F= -v key="${key}" '
    $1 == key {
      val = $0
      sub(/^[^=]*=/, "", val)
      gsub(/^[ \t]+|[ \t]+$/, "", val)
      print val
      found = 1
      exit
    }
    END { if (!found) exit 1 }
  ' "${ENV_FILE}"
}

port_in_use_by_other_process() {
  local port="$1"
  if [[ -z "${port}" || ! "${port}" =~ ^[0-9]+$ ]]; then
    return 1
  fi

  if command -v lsof >/dev/null 2>&1; then
    local pids
    pids="$(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null | tr '\n' ' ')"
    if [[ -n "${pids// }" ]]; then
      if command -v docker >/dev/null 2>&1; then
        local docker_pids
        docker_pids="$(docker ps -q 2>/dev/null | xargs -r docker inspect -f '{{.State.Pid}}' 2>/dev/null | tr '\n' ' ')"
        for pid in ${pids}; do
          if [[ " ${docker_pids} " != *" ${pid} "* ]]; then
            return 0
          fi
        done
      else
        return 0
      fi
    fi
  elif command -v ss >/dev/null 2>&1; then
    if ss -ltn "( sport = :${port} )" 2>/dev/null | grep -q ":${port}"; then
      log_warn "Port ${port} is already listening (unable to confirm process owner without lsof)."
    fi
  fi

  return 1
}

wait_for_containers_healthy() {
  local timeout="$1"
  local start_ts now elapsed
  local container_ids
  local all_ready state health name rest

  container_ids="$(docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ps -q)"
  [[ -n "$(printf "%s" "${container_ids}" | tr -d '[:space:]')" ]] || fail "No containers were created by compose."

  start_ts="$(date +%s)"

  while true; do
    all_ready=1

    while IFS= read -r line; do
      name="${line%%|*}"
      rest="${line#*|}"
      state="${rest%%|*}"
      health="${rest##*|}"
      name="${name#/}"

      if [[ "${state}" != "running" ]]; then
        fail "Container ${name} is not running (state=${state})."
      fi

      if [[ "${health}" == "none" || "${health}" == "healthy" ]]; then
        continue
      fi

      all_ready=0
    done < <(docker inspect --format '{{.Name}}|{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' ${container_ids})

    if [[ "${all_ready}" == "1" ]]; then
      log_success "All containers are running and healthy."
      return 0
    fi

    now="$(date +%s)"
    elapsed="$((now - start_ts))"
    if (( elapsed >= timeout )); then
      fail "Container health check timed out after ${timeout}s."
    fi

    sleep 3
  done
}

run_smoke_checks() {
  local next_port strapi_port
  next_port="$(load_env_value NEXT_PORT || true)"
  strapi_port="$(load_env_value STRAPI_PORT || true)"

  if [[ -n "${next_port}" ]]; then
    curl -fsS "http://127.0.0.1:${next_port}/api/health" >/dev/null || fail "Next.js health check failed on port ${next_port}."
  fi
  if [[ -n "${strapi_port}" ]]; then
    curl -fsS "http://127.0.0.1:${strapi_port}/api/health" >/dev/null || fail "Strapi health check failed on port ${strapi_port}."
  fi

  log_success "Smoke checks passed."
}

main() {
  cd "${PROJECT_DIR}"
  log_step "Preflight checks"

  require_cmd git
  require_cmd docker
  if [[ "${SMOKE_CHECK}" == "1" ]]; then
    require_cmd curl
  fi

  docker compose version >/dev/null 2>&1 || fail "docker compose is unavailable."
  docker ps >/dev/null 2>&1 || fail "docker daemon is not ready or permission denied."

  [[ -f "${COMPOSE_FILE}" ]] || fail "Compose file not found: ${PROJECT_DIR}/${COMPOSE_FILE}"
  [[ -f "${ENV_FILE}" ]] || fail "Env file not found: ${PROJECT_DIR}/${ENV_FILE}"

  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not a git repository: ${PROJECT_DIR}"

  local next_port strapi_port postgres_port
  next_port="$(load_env_value NEXT_PORT || true)"
  strapi_port="$(load_env_value STRAPI_PORT || true)"
  postgres_port="$(load_env_value POSTGRES_PORT || true)"

  require_nonempty_env_key APP_URL
  require_nonempty_env_key NEXT_PUBLIC_API_URL
  require_nonempty_env_key STRAPI_PUBLIC_URL
  require_nonempty_env_key STRAPI_URL
  require_nonempty_env_key POSTGRES_PASSWORD
  require_nonempty_env_key DATABASE_PASSWORD
  require_secret_env_key APP_KEYS
  require_secret_env_key API_TOKEN_SALT
  require_secret_env_key ADMIN_JWT_SECRET
  require_secret_env_key TRANSFER_TOKEN_SALT
  require_secret_env_key JWT_SECRET
  require_secret_env_key ENCRYPTION_KEY
  require_nonempty_env_key STRAPI_ADMIN_EMAIL
  require_nonempty_env_key STRAPI_ADMIN_PASSWORD

  for port in "${next_port}" "${strapi_port}" "${postgres_port}"; do
    if port_in_use_by_other_process "${port}"; then
      fail "Port ${port} is occupied by a non-container process."
    fi
  done

  log_success "Preflight checks passed"

  if [[ "${SKIP_GIT_PULL}" == "1" ]]; then
    log_warn "SKIP_GIT_PULL=1, skipping git pull."
  else
    log_step "Git update"
    git pull --ff-only
    log_success "Git pull completed"
  fi

  if [[ "${SKIP_BUILD}" == "1" ]]; then
    log_warn "SKIP_BUILD=1, skipping docker build."
  else
    log_step "Docker build"
    docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" build
    log_success "Docker build completed"
  fi

  log_step "Docker up"
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d
  log_success "Containers started"

  log_step "Wait for container health"
  wait_for_containers_healthy "${HEALTH_TIMEOUT}"

  if [[ "${SMOKE_CHECK}" == "1" ]]; then
    log_step "Run smoke checks"
    run_smoke_checks
  else
    log_warn "SMOKE_CHECK=0, skip health endpoint smoke checks."
  fi

  log_step "Container status"
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ps

  local app_url api_url
  app_url="$(load_env_value APP_URL || true)"
  api_url="$(load_env_value NEXT_PUBLIC_API_URL || true)"

  if [[ -n "${app_url}" ]]; then
    log_info "Frontend: ${app_url}"
  fi
  if [[ -n "${api_url}" ]]; then
    log_info "API/CMS: ${api_url}"
    log_info "Strapi Admin: ${api_url%/}/admin"
  else
    log_warn "NEXT_PUBLIC_API_URL is empty in ${ENV_FILE}; unable to print Strapi Admin URL."
  fi

  log_success "Production deployment finished"
}

trap 'fail "Deployment failed at line ${LINENO}."' ERR

main "$@"
