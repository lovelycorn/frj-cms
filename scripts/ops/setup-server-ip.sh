#!/usr/bin/env bash
set -euo pipefail

PUBLIC_IP="${PUBLIC_IP:-165.154.163.41}"
FRONTEND_PORT="${FRONTEND_PORT:-18080}"
CMS_PORT="${CMS_PORT:-10086}"
SSH_PORT="${SSH_PORT:-22}"
CREATE_SWAP_MB="${CREATE_SWAP_MB:-2048}"
INSTALL_NGINX_CERTBOT="${INSTALL_NGINX_CERTBOT:-true}"
ENABLE_UFW="${ENABLE_UFW:-true}"

log() {
  printf "[setup] %s\n" "$1"
}

require_sudo() {
  if ! command -v sudo >/dev/null 2>&1; then
    echo "sudo is required but not found." >&2
    exit 1
  fi
}

add_swap_if_needed() {
  if [[ "${CREATE_SWAP_MB}" -le 0 ]]; then
    return
  fi

  if [[ ! -r /proc/meminfo ]]; then
    return
  fi

  local swap_kb
  swap_kb="$(awk '/SwapTotal/ {print $2}' /proc/meminfo)"
  if [[ "${swap_kb}" -gt 0 ]]; then
    log "Swap already exists, skip creating swapfile."
    return
  fi

  log "Creating ${CREATE_SWAP_MB}MB swapfile at /swapfile"
  sudo fallocate -l "${CREATE_SWAP_MB}M" /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  if ! grep -q '^/swapfile ' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
  fi
}

install_docker_if_needed() {
  if command -v docker >/dev/null 2>&1; then
    log "Docker already installed."
    return
  fi

  log "Installing Docker via official convenience script."
  curl -fsSL https://get.docker.com | sudo sh
  sudo systemctl enable --now docker
}

ensure_docker_group() {
  if id -nG "$USER" | grep -qw docker; then
    log "User already in docker group."
    return
  fi

  log "Adding current user to docker group."
  sudo usermod -aG docker "$USER"
  log "Please re-login after setup for docker group to take effect."
}

setup_ufw() {
  if [[ "${ENABLE_UFW}" != "true" ]]; then
    log "Skipping UFW setup by config."
    return
  fi

  log "Configuring UFW for SSH, frontend, and cms ports."
  sudo ufw allow "${SSH_PORT}/tcp"
  sudo ufw allow "${FRONTEND_PORT}/tcp"
  sudo ufw allow "${CMS_PORT}/tcp"
  sudo ufw --force enable
}

install_optional_nginx_certbot() {
  if [[ "${INSTALL_NGINX_CERTBOT}" != "true" ]]; then
    log "Skipping Nginx/Certbot installation by config."
    return
  fi

  log "Installing optional Nginx + Certbot packages."
  sudo apt-get install -y nginx certbot python3-certbot-nginx
  sudo systemctl enable --now nginx
}

main() {
  require_sudo

  log "Target server public entry: http://${PUBLIC_IP}:${FRONTEND_PORT} and http://${PUBLIC_IP}:${CMS_PORT}"
  log "Updating apt index and installing base packages."
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg git ufw openssl

  add_swap_if_needed
  install_docker_if_needed
  ensure_docker_group
  setup_ufw
  install_optional_nginx_certbot

  log "Setup complete."
  log "Check: docker --version && docker compose version"
}

main "$@"
