#!/usr/bin/env bash
# Deployment entrypoint for engineerdanyal.com
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker/docker-compose.yml"
ENV_FILE="${ROOT_DIR}/.env"

# shellcheck disable=SC1091
set -a
# Load ports for health check URL
# Prefer .env if present
if [[ -f "${ENV_FILE}" ]]; then
  # Export selected vars without sourcing secrets into the shell history via set -x
  BACKEND_PORT="$(grep -E '^BACKEND_PORT=' "${ENV_FILE}" | tail -1 | cut -d= -f2- || true)"
fi
BACKEND_PORT="${BACKEND_PORT:-4000}"
set +a

log() {
  echo "[run.sh] $*"
}

fail() {
  echo "[run.sh] ERROR: $*" >&2
  exit 1
}

log "Starting deployment from ${ROOT_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  fail "Missing .env — copy .env.production.example to .env and fill in values"
fi

if [[ ! -f "${COMPOSE_FILE}" ]]; then
  fail "Missing compose file at ${COMPOSE_FILE}"
fi

if ! command -v docker >/dev/null 2>&1; then
  fail "Docker is not installed"
fi

log "Building and starting containers..."
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --build

log "Waiting for backend health on 127.0.0.1:${BACKEND_PORT}..."
ATTEMPTS=60
for ((i = 1; i <= ATTEMPTS; i++)); do
  if curl -sf "http://127.0.0.1:${BACKEND_PORT}/api/health" >/dev/null; then
    log "Backend healthy"
    break
  fi
  if [[ "${i}" -eq "${ATTEMPTS}" ]]; then
    log "Backend logs (last 80 lines):"
    docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" logs --tail=80 backend || true
    fail "Backend health check failed after ${ATTEMPTS} attempts"
  fi
  sleep 2
done

log "Deployment complete"
docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps
