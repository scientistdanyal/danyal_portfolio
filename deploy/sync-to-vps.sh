#!/usr/bin/env bash
# Sync project to VPS and (optionally) run remote deploy.
# Usage:
#   ./deploy/sync-to-vps.sh root@64.177.119.157 --deploy
# App path: /home/danyalportfolio/engineerdanyal (user: danyalportfolio)
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"
DO_DEPLOY="${2:-}"

if [[ -z "${TARGET}" ]]; then
  echo "Usage: $0 user@host [--deploy]" >&2
  echo "  Example: $0 root@64.177.119.157 --deploy" >&2
  exit 1
fi

REMOTE_DIR="${REMOTE_DIR:-/home/danyalportfolio/engineerdanyal}"
REMOTE_USER="${REMOTE_USER:-danyalportfolio}"

echo "[sync] ${ROOT_DIR} → ${TARGET}:${REMOTE_DIR}"

ssh "${TARGET}" "mkdir -p '${REMOTE_DIR}' && chown -R ${REMOTE_USER}:${REMOTE_USER} /home/danyalportfolio"

rsync -az --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'frontend/node_modules' \
  --exclude 'backend/node_modules' \
  --exclude 'frontend/.next' \
  --exclude 'backend/dist' \
  --exclude 'backend/.env' \
  --exclude '.env' \
  --exclude '**/.DS_Store' \
  "${ROOT_DIR}/" "${TARGET}:${REMOTE_DIR}/"

rsync -az \
  "${ROOT_DIR}/backend/uploads/" "${TARGET}:${REMOTE_DIR}/backend/uploads/" || true

ssh "${TARGET}" "chown -R ${REMOTE_USER}:${REMOTE_USER} '${REMOTE_DIR}'"

echo "[sync] done"

if [[ "${DO_DEPLOY}" != "--deploy" ]]; then
  exit 0
fi

echo "[sync] running remote bootstrap + ./run.sh as ${REMOTE_USER}"
ssh "${TARGET}" bash -s -- "${REMOTE_DIR}" "${REMOTE_USER}" <<'REMOTE'
set -euo pipefail
REMOTE_DIR="$1"
REMOTE_USER="$2"

if ! command -v docker >/dev/null 2>&1; then
  bash "${REMOTE_DIR}/deploy/bootstrap-vps.sh"
fi

if [[ ! -f "${REMOTE_DIR}/.env" ]]; then
  if [[ -f /opt/engineerdanyal/.env ]]; then
    cp /opt/engineerdanyal/.env "${REMOTE_DIR}/.env"
  else
    cp "${REMOTE_DIR}/.env.production.example" "${REMOTE_DIR}/.env"
    if grep -q 'CHANGE_ME_STRONG_DB_PASSWORD' "${REMOTE_DIR}/.env"; then
      DB_PASS="$(openssl rand -hex 24)"
      JWT="$(openssl rand -hex 32)"
      ADMIN_PASS="$(openssl rand -hex 16)"
      sed -i "s/CHANGE_ME_STRONG_DB_PASSWORD/${DB_PASS}/g" "${REMOTE_DIR}/.env"
      sed -i "s/CHANGE_ME_JWT_SECRET_MIN_32_CHARS/${JWT}/g" "${REMOTE_DIR}/.env"
      sed -i "s/CHANGE_ME_STRONG_ADMIN_PASSWORD/${ADMIN_PASS}/g" "${REMOTE_DIR}/.env"
      echo "[remote] ADMIN_PASSWORD=${ADMIN_PASS}"
    fi
  fi
fi

chmod +x "${REMOTE_DIR}/run.sh" "${REMOTE_DIR}/backend/docker-entrypoint.sh" "${REMOTE_DIR}/deploy/bootstrap-vps.sh" || true
chown -R "${REMOTE_USER}:${REMOTE_USER}" "${REMOTE_DIR}"

# Stop any previous root-owned stack on /opt to free ports
if [[ -f /opt/engineerdanyal/docker/docker-compose.yml && -f /opt/engineerdanyal/.env ]]; then
  docker compose -f /opt/engineerdanyal/docker/docker-compose.yml --env-file /opt/engineerdanyal/.env down || true
fi

sudo -u "${REMOTE_USER}" -H bash -lc "cd '${REMOTE_DIR}' && ./run.sh"

if sudo -u "${REMOTE_USER}" -H bash -lc "cd '${REMOTE_DIR}' && docker compose -f docker/docker-compose.yml --env-file .env ps --status running" | grep -q backend; then
  sudo -u "${REMOTE_USER}" -H bash -lc "cd '${REMOTE_DIR}' && docker compose -f docker/docker-compose.yml --env-file .env cp ./backend/uploads/. backend:/app/uploads/" || true
fi

if [[ -d /etc/nginx/sites-available ]]; then
  cp "${REMOTE_DIR}/deploy/nginx/engineerdanyal.conf" /etc/nginx/sites-available/engineerdanyal
  ln -sf /etc/nginx/sites-available/engineerdanyal /etc/nginx/sites-enabled/
  rm -f /etc/nginx/sites-enabled/default
  mkdir -p /var/www/certbot
  nginx -t && systemctl reload nginx || true
fi

curl -sf http://127.0.0.1:4000/api/health && echo
REMOTE
