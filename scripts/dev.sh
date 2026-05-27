#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.dev.yml}"
ENV_FILE="${ENV_FILE:-.env.development}"

if [[ -t 1 ]]; then
  C_INFO='\033[1;34m'; C_STEP='\033[1;36m'; C_SUCCESS='\033[1;32m'; C_ERROR='\033[1;31m'; C_RESET='\033[0m'
else
  C_INFO=''; C_STEP=''; C_SUCCESS=''; C_ERROR=''; C_RESET=''
fi

log_info() { printf "%b[INFO]%b %s\n" "${C_INFO}" "${C_RESET}" "$1"; }
log_step() { printf "%b[STEP]%b %s\n" "${C_STEP}" "${C_RESET}" "$1"; }
log_success() { printf "%b[SUCCESS]%b %s\n" "${C_SUCCESS}" "${C_RESET}" "$1"; }
log_error() { printf "%b[ERROR]%b %s\n" "${C_ERROR}" "${C_RESET}" "$1" >&2; }

cd "${PROJECT_DIR}"

[[ -f "${COMPOSE_FILE}" ]] || { log_error "Compose file not found: ${PROJECT_DIR}/${COMPOSE_FILE}"; exit 1; }
[[ -f "${ENV_FILE}" ]] || { log_error "Env file not found: ${PROJECT_DIR}/${ENV_FILE}"; exit 1; }

log_step "Starting development stack"
docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up --build "$@"
log_success "Development stack stopped"
