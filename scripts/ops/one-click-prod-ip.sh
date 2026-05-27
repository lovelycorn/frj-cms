#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/opt/frj-cms}"

if [[ ! -d "${PROJECT_DIR}" ]]; then
  echo "Project dir not found: ${PROJECT_DIR}" >&2
  exit 1
fi

cd "${PROJECT_DIR}"

./scripts/ops/setup-server-ip.sh "$@"
./scripts/ops/deploy-prod-ip.sh "$@"
