#!/usr/bin/env bash
set -uo pipefail

OUTPUT_FILE="${1:-production-server-report.md}"
PROJECT_DIR="${PROJECT_DIR:-$(pwd)}"
ENV_FILE="${ENV_FILE:-${PROJECT_DIR}/.env.production}"
COMPOSE_FILE="${COMPOSE_FILE:-${PROJECT_DIR}/docker-compose.prod.yml}"
ACCESS_MODE="${ACCESS_MODE:-ip-port}"
PUBLIC_IP="${PUBLIC_IP:-165.154.163.41}"
FRONTEND_PUBLIC_PORT="${FRONTEND_PUBLIC_PORT:-18080}"
CMS_PUBLIC_PORT="${CMS_PUBLIC_PORT:-10086}"
FRONTEND_PUBLIC_URL="${FRONTEND_PUBLIC_URL:-http://${PUBLIC_IP}:${FRONTEND_PUBLIC_PORT}}"
CMS_PUBLIC_URL="${CMS_PUBLIC_URL:-http://${PUBLIC_IP}:${CMS_PUBLIC_PORT}}"
FRONTEND_DOMAIN="${FRONTEND_DOMAIN:-}"
ROOT_DOMAIN="${ROOT_DOMAIN:-}"
CMS_DOMAIN="${CMS_DOMAIN:-}"

now_utc() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

has_cmd() {
  command -v "$1" >/dev/null 2>&1
}

run() {
  "$@" 2>&1 || true
}

one_line() {
  tr '\n' ' ' | sed 's/[[:space:]][[:space:]]*/ /g; s/^ //; s/ $//'
}

cmd_value() {
  if has_cmd "$1"; then
    run "$@" | one_line
  else
    printf "not installed"
  fi
}

http_probe() {
  local url="$1"
  if ! has_cmd curl; then
    printf "curl not installed"
    return
  fi

  curl -L -sS -o /dev/null \
    --connect-timeout 5 \
    --max-time 12 \
    -w "http=%{http_code} remote_ip=%{remote_ip} total=%{time_total}s" \
    "$url" 2>&1 || true
}

public_ip() {
  if has_cmd curl; then
    curl -4 -fsS --connect-timeout 4 --max-time 8 https://api.ipify.org 2>/dev/null || true
  fi
}

tcp_probe() {
  local host="$1"
  local port="$2"
  if has_cmd nc; then
    nc -vz -w 5 "${host}" "${port}" 2>&1 | one_line
  elif has_cmd timeout && has_cmd bash; then
    timeout 5 bash -c "cat < /dev/null > /dev/tcp/${host}/${port}" >/dev/null 2>&1 \
      && printf "open" || printf "closed or filtered"
  else
    printf "nc not installed"
  fi
}

domain_a_records() {
  local domain="$1"
  if [[ -z "${domain}" ]]; then
    printf "not provided"
    return
  fi

  if has_cmd getent; then
    getent ahostsv4 "${domain}" 2>/dev/null | awk '{print $1}' | sort -u | one_line
  elif has_cmd dig; then
    dig +short A "${domain}" 2>/dev/null | sort -u | one_line
  elif has_cmd nslookup; then
    nslookup "${domain}" 2>/dev/null | awk '/^Address: / {print $2}' | one_line
  else
    printf "no resolver command found"
  fi
}

env_raw() {
  local key="$1"
  if [[ ! -f "${ENV_FILE}" ]]; then
    return 1
  fi

  awk -F= -v key="${key}" '$1 == key {sub(/^[^=]*=/, ""); value=$0} END {if (value != "") print value}' "${ENV_FILE}"
}

env_status() {
  local key="$1"
  local value
  value="$(env_raw "${key}")"

  if [[ -z "${value}" ]]; then
    printf "missing"
    return
  fi

  case "${key}" in
    *PASSWORD*|*SECRET*|*SALT*|*KEY*|APP_KEYS|DATABASE_URL)
      if [[ "${value}" =~ changeMe|Admin123456|^strapi$|example\.com ]]; then
        printf "set but still looks like a default placeholder"
      else
        printf "set, redacted, length=%s" "${#value}"
      fi
      ;;
    *)
      if [[ "${value}" =~ example\.com ]]; then
        printf "%s (placeholder)" "${value}"
      else
        printf "%s" "${value}"
      fi
      ;;
  esac
}

docker_compose_ps() {
  if ! has_cmd docker; then
    printf "docker not installed"
    return
  fi

  if [[ ! -f "${COMPOSE_FILE}" ]]; then
    printf "compose file not found: %s" "${COMPOSE_FILE}"
    return
  fi

  if [[ -f "${ENV_FILE}" ]]; then
    run docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" ps
  else
    run docker compose -f "${COMPOSE_FILE}" ps
  fi
}

warn_checks() {
  local warnings=()
  local mem_kb=""
  local swap_kb=""
  local os_id=""
  local os_version=""

  if [[ -r /proc/meminfo ]]; then
    mem_kb="$(awk '/MemTotal/ {print $2}' /proc/meminfo)"
    swap_kb="$(awk '/SwapTotal/ {print $2}' /proc/meminfo)"
  fi

  if [[ -r /etc/os-release ]]; then
    os_id="$(. /etc/os-release && printf "%s" "${ID:-}")"
    os_version="$(. /etc/os-release && printf "%s" "${VERSION_ID:-}")"
  fi

  if [[ "${os_id}" != "ubuntu" || "${os_version}" != "24.04" ]]; then
    warnings+=("Recommended target is Ubuntu 24.04 LTS; detected ${os_id:-unknown} ${os_version:-unknown}.")
  fi

  if [[ -n "${mem_kb}" && "${mem_kb}" -lt 3800000 ]]; then
    warnings+=("RAM is below the recommended 4GB for local Docker builds.")
  fi

  if [[ -n "${swap_kb}" && "${swap_kb}" -eq 0 ]]; then
    warnings+=("Swap is not enabled; add 2GB swap before first production build on small servers.")
  fi

  if ! has_cmd docker; then
    warnings+=("Docker is not installed.")
  elif ! docker ps >/dev/null 2>&1; then
    warnings+=("Current user cannot run docker ps; add the user to the docker group or use sudo.")
  fi

  if [[ "${ACCESS_MODE}" != "ip-port" ]] && ! has_cmd nginx; then
    warnings+=("Nginx is not installed; HTTPS reverse proxy setup still needs it.")
  fi

  if [[ "${ACCESS_MODE}" == "ip-port" ]]; then
    warnings+=("IP+port mode exposes HTTP directly. This is simple for first launch, but HTTPS/domain mode should replace it before collecting sensitive traffic.")
  fi

  if [[ ! -f "${ENV_FILE}" ]]; then
    warnings+=(".env.production was not found at ${ENV_FILE}.")
  fi

  if [[ ${#warnings[@]} -eq 0 ]]; then
    printf "No obvious blocker detected by this read-only script.\n"
    return
  fi

  local warning
  for warning in "${warnings[@]}"; do
    printf -- "- %s\n" "${warning}"
  done
}

{
  printf "# FRJ CMS Production Server Report\n\n"
  printf "- Generated at UTC: %s\n" "$(now_utc)"
  printf "- Script path: %s\n" "$0"
  printf "- Project dir: %s\n" "${PROJECT_DIR}"
  printf "- Env file checked: %s\n" "${ENV_FILE}"
  printf "- Compose file checked: %s\n" "${COMPOSE_FILE}"
  printf "- Access mode: %s\n" "${ACCESS_MODE}"
  printf "- Public IP input: %s\n" "${PUBLIC_IP}"
  printf "- Frontend public URL input: %s\n" "${FRONTEND_PUBLIC_URL}"
  printf "- CMS/API public URL input: %s\n" "${CMS_PUBLIC_URL}"
  printf "- Frontend domain input: %s\n" "${FRONTEND_DOMAIN:-not provided}"
  printf "- Root domain input: %s\n" "${ROOT_DOMAIN:-not provided}"
  printf "- CMS domain input: %s\n\n" "${CMS_DOMAIN:-not provided}"

  printf "## Quick Warnings\n\n"
  warn_checks

  printf "\n## Server Basics\n\n"
  printf "| Item | Value |\n"
  printf "| --- | --- |\n"
  printf "| Hostname | %s |\n" "$(cmd_value hostname)"
  printf "| Current user | %s |\n" "$(cmd_value whoami)"
  printf "| Kernel | %s |\n" "$(cmd_value uname -a)"
  printf "| Architecture | %s |\n" "$(cmd_value uname -m)"
  if [[ -r /etc/os-release ]]; then
    printf "| OS release | %s |\n" "$(grep -E '^(PRETTY_NAME|ID|VERSION_ID)=' /etc/os-release | one_line)"
  else
    printf "| OS release | /etc/os-release not readable |\n"
  fi
  printf "| CPU cores | %s |\n" "$(cmd_value nproc)"
  printf "| Memory | %s |\n" "$(cmd_value free -h)"
  printf "| Root disk | %s |\n" "$(cmd_value df -h /)"
  printf "| Block devices | %s |\n" "$(cmd_value lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS)"
  printf "| Public IPv4 | %s |\n" "$(public_ip | one_line)"
  printf "| Local addresses | %s |\n" "$(cmd_value hostname -I)"

  printf "\n## Public IP And Port Checks\n\n"
  printf "| Item | Value |\n"
  printf "| --- | --- |\n"
  printf "| Expected public IP | %s |\n" "${PUBLIC_IP}"
  printf "| Server reported public IPv4 | %s |\n" "$(public_ip | one_line)"
  printf "| Frontend URL | %s |\n" "${FRONTEND_PUBLIC_URL}"
  printf "| CMS/API URL | %s |\n" "${CMS_PUBLIC_URL}"
  printf "| TCP %s:%s | %s |\n" "${PUBLIC_IP}" "${FRONTEND_PUBLIC_PORT}" "$(tcp_probe "${PUBLIC_IP}" "${FRONTEND_PUBLIC_PORT}")"
  printf "| TCP %s:%s | %s |\n" "${PUBLIC_IP}" "${CMS_PUBLIC_PORT}" "$(tcp_probe "${PUBLIC_IP}" "${CMS_PUBLIC_PORT}")"
  printf "| Frontend health over public URL | %s |\n" "$(http_probe "${FRONTEND_PUBLIC_URL}/api/health")"
  printf "| CMS health over public URL | %s |\n" "$(http_probe "${CMS_PUBLIC_URL}/api/health")"
  printf "| CMS admin over public URL | %s |\n" "$(http_probe "${CMS_PUBLIC_URL}/admin")"

  printf "\n## DNS Checks Optional\n\n"
  printf "No DNS records are required for the current IP+port deployment mode.\n\n"
  printf "| Domain | A records seen from server |\n"
  printf "| --- | --- |\n"
  printf "| %s | %s |\n" "${FRONTEND_DOMAIN:-not provided}" "$(domain_a_records "${FRONTEND_DOMAIN}")"
  printf "| %s | %s |\n" "${ROOT_DOMAIN:-not provided}" "$(domain_a_records "${ROOT_DOMAIN}")"
  printf "| %s | %s |\n" "${CMS_DOMAIN:-not provided}" "$(domain_a_records "${CMS_DOMAIN}")"

  printf "\n## Network And Firewall\n\n"
  printf "| Item | Value |\n"
  printf "| --- | --- |\n"
  printf "| Listening TCP ports | %s |\n" "$(cmd_value ss -ltnp)"
  printf "| UFW status | %s |\n" "$(cmd_value ufw status verbose)"
  printf "| firewalld state | %s |\n" "$(cmd_value firewall-cmd --state)"
  printf "| iptables rules | %s |\n" "$(cmd_value iptables -S)"

  printf "\n## Required Outbound Connectivity\n\n"
  printf "| Target | Result |\n"
  printf "| --- | --- |\n"
  printf "| https://registry.npmjs.org | %s |\n" "$(http_probe https://registry.npmjs.org)"
  printf "| https://registry-1.docker.io/v2/ | %s |\n" "$(http_probe https://registry-1.docker.io/v2/)"
  printf "| https://github.com | %s |\n" "$(http_probe https://github.com)"

  printf "\n## Docker\n\n"
  printf "| Item | Value |\n"
  printf "| --- | --- |\n"
  printf "| docker version | %s |\n" "$(cmd_value docker --version)"
  printf "| docker compose version | %s |\n" "$(cmd_value docker compose version)"
  printf "| docker service | %s |\n" "$(cmd_value systemctl is-active docker)"
  printf "| docker ps | %s |\n" "$(cmd_value docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}')"
  printf "| docker disk usage | %s |\n" "$(cmd_value docker system df)"

  printf "\n## Nginx And TLS Tools Optional\n\n"
  printf "These are optional for the current IP+port deployment mode and only become required after switching to domain + HTTPS.\n\n"
  printf "| Item | Value |\n"
  printf "| --- | --- |\n"
  printf "| nginx version | %s |\n" "$(cmd_value nginx -v)"
  printf "| nginx service | %s |\n" "$(cmd_value systemctl is-active nginx)"
  printf "| certbot version | %s |\n" "$(cmd_value certbot --version)"
  printf "| nginx config test | %s |\n" "$(cmd_value nginx -t)"

  printf "\n## Project Files\n\n"
  printf "| Item | Value |\n"
  printf "| --- | --- |\n"
  printf "| Project dir exists | %s |\n" "$([[ -d "${PROJECT_DIR}" ]] && printf yes || printf no)"
  printf "| docker-compose.prod.yml exists | %s |\n" "$([[ -f "${COMPOSE_FILE}" ]] && printf yes || printf no)"
  printf "| .env.production exists | %s |\n" "$([[ -f "${ENV_FILE}" ]] && printf yes || printf no)"
  if [[ -d "${PROJECT_DIR}/.git" ]]; then
    printf "| Git remote | %s |\n" "$(cd "${PROJECT_DIR}" && cmd_value git remote -v)"
    printf "| Git branch | %s |\n" "$(cd "${PROJECT_DIR}" && cmd_value git branch --show-current)"
    printf "| Git commit | %s |\n" "$(cd "${PROJECT_DIR}" && cmd_value git rev-parse --short HEAD)"
    printf "| Git status | %s |\n" "$(cd "${PROJECT_DIR}" && cmd_value git status --short)"
  else
    printf "| Git repo | not found in project dir |\n"
  fi

  printf "\n## Production Env Status\n\n"
  printf "Sensitive values are never printed. This table only reports missing, placeholder, or redacted status.\n\n"
  printf "| Variable | Status |\n"
  printf "| --- | --- |\n"
  for key in \
    NODE_ENV SITE_CODE APP_URL NEXT_PUBLIC_API_URL STRAPI_PUBLIC_URL STRAPI_URL \
    NODE_IMAGE POSTGRES_IMAGE NPM_REGISTRY \
    NEXT_BIND_ADDR STRAPI_BIND_ADDR POSTGRES_BIND_ADDR NEXT_PORT STRAPI_PORT POSTGRES_PORT \
    POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD \
    DATABASE_HOST DATABASE_PORT DATABASE_NAME DATABASE_USERNAME DATABASE_PASSWORD DATABASE_SSL DATABASE_URL \
    APP_KEYS API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET ENCRYPTION_KEY \
    STRAPI_ADMIN_EMAIL STRAPI_ADMIN_PASSWORD; do
    printf "| %s | %s |\n" "${key}" "$(env_status "${key}")"
  done

  printf "\n## Expected Public Env For IP+Port Mode\n\n"
  printf "| Variable | Expected value for current plan |\n"
  printf "| --- | --- |\n"
  printf "| APP_URL | %s |\n" "${FRONTEND_PUBLIC_URL}"
  printf "| NEXT_PUBLIC_API_URL | %s |\n" "${CMS_PUBLIC_URL}"
  printf "| STRAPI_PUBLIC_URL | %s |\n" "${CMS_PUBLIC_URL}"
  printf "| STRAPI_URL | http://strapi-prod:1337 |\n"
  printf "| NEXT_BIND_ADDR | 0.0.0.0 |\n"
  printf "| STRAPI_BIND_ADDR | 0.0.0.0 |\n"
  printf "| POSTGRES_BIND_ADDR | 127.0.0.1 |\n"
  printf "| NEXT_PORT | %s |\n" "${FRONTEND_PUBLIC_PORT}"
  printf "| STRAPI_PORT | %s |\n" "${CMS_PUBLIC_PORT}"
  printf "| POSTGRES_PORT | 5432 |\n"

  printf "\n## Compose Status\n\n"
  printf '```text\n'
  docker_compose_ps
  printf '\n```\n'

  printf "\n## Next Step\n\n"
  printf "Send this report together with docs/production-info-form.md after filling the missing business/deployment decisions.\n"
} > "${OUTPUT_FILE}"

printf "Production server report written to %s\n" "${OUTPUT_FILE}"
