#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
ENV_FILE="${ENV_FILE:-.env.production}"

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

main() {
  cd "${PROJECT_DIR}"
  log_step "Preflight checks"

  require_cmd git
  require_cmd docker

  docker compose version >/dev/null 2>&1 || fail "docker compose is unavailable."
  docker ps >/dev/null 2>&1 || fail "docker daemon is not ready or permission denied."

  [[ -f "${COMPOSE_FILE}" ]] || fail "Compose file not found: ${PROJECT_DIR}/${COMPOSE_FILE}"
  [[ -f "${ENV_FILE}" ]] || fail "Env file not found: ${PROJECT_DIR}/${ENV_FILE}"

  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not a git repository: ${PROJECT_DIR}"

  local next_port strapi_port postgres_port
  next_port="$(load_env_value NEXT_PORT || true)"
  strapi_port="$(load_env_value STRAPI_PORT || true)"
  postgres_port="$(load_env_value POSTGRES_PORT || true)"

  for port in "${next_port}" "${strapi_port}" "${postgres_port}"; do
    if port_in_use_by_other_process "${port}"; then
      fail "Port ${port} is occupied by a non-container process."
    fi
  done

  log_success "Preflight checks passed"

  log_step "Git update"
  git pull --ff-only
  log_success "Git pull completed"

  log_step "Docker build"
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" build
  log_success "Docker build completed"

  log_step "Docker up"
  docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d
  log_success "Containers started"

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
