#!/usr/bin/env bash
# Deployment entrypoint for engineerdanyal.com
# Builds new images FIRST (old containers keep serving), then swaps them.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${ROOT_DIR}/docker/docker-compose.yml"
ENV_FILE="${ROOT_DIR}/.env"

BACKEND_PORT=4000
FRONTEND_PORT=3000
if [[ -f "${ENV_FILE}" ]]; then
  BACKEND_PORT="$(grep -E '^BACKEND_PORT=' "${ENV_FILE}" | tail -1 | cut -d= -f2- || true)"
  FRONTEND_PORT="$(grep -E '^FRONTEND_PORT=' "${ENV_FILE}" | tail -1 | cut -d= -f2- || true)"
fi
BACKEND_PORT="${BACKEND_PORT:-4000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

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

COMPOSE=(docker compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}")

# 1) Build while old containers (if any) keep answering Nginx → no long 502 window
log "Building images (site stays up if already running)..."
"${COMPOSE[@]}" build

# 2) Recreate/start with new images — brief cutover only
log "Starting / swapping containers..."
"${COMPOSE[@]}" up -d --remove-orphans

log "Waiting for backend health on 127.0.0.1:${BACKEND_PORT}..."
ATTEMPTS=60
for ((i = 1; i <= ATTEMPTS; i++)); do
  if curl -sf "http://127.0.0.1:${BACKEND_PORT}/api/health" >/dev/null; then
    log "Backend healthy"
    break
  fi
  if [[ "${i}" -eq "${ATTEMPTS}" ]]; then
    log "Backend logs (last 80 lines):"
    "${COMPOSE[@]}" logs --tail=80 backend || true
    fail "Backend health check failed after ${ATTEMPTS} attempts"
  fi
  sleep 2
done

# Ensure frontend is answering too
for ((i = 1; i <= 30; i++)); do
  if curl -sf "http://127.0.0.1:${FRONTEND_PORT}/" >/dev/null; then
    log "Frontend healthy"
    break
  fi
  sleep 2
done

log "Deployment complete"
"${COMPOSE[@]}" ps
