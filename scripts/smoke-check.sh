#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
STRAPI_URL="${STRAPI_URL:-http://localhost:1337}"

check_http() {
  local target="$1"
  local name="$2"
  local code

  code="$(curl -g -s -o /dev/null -w "%{http_code}" "${target}")"
  if [[ "${code}" -ge 200 && "${code}" -lt 400 ]]; then
    echo "[OK] ${name}: ${target} (${code})"
    return 0
  fi

  echo "[FAIL] ${name}: ${target} (${code})" >&2
  return 1
}

echo "Running smoke checks..."
echo "Frontend URL: ${FRONTEND_URL}"
echo "Strapi URL: ${STRAPI_URL}"

check_http "${FRONTEND_URL}/api/health" "Next.js health"
check_http "${STRAPI_URL}/api/health" "Strapi health"
check_http "${FRONTEND_URL}" "Homepage"
check_http "${FRONTEND_URL}/products" "Product list page"
check_http "${STRAPI_URL}/api/products?pagination[pageSize]=1" "Products API"

echo "All smoke checks passed."
