#!/bin/sh
set -eu

echo "[backend] Applying database migrations..."
ATTEMPTS=40
i=1
while [ "$i" -le "$ATTEMPTS" ]; do
  if npx prisma migrate deploy; then
    echo "[backend] Migrations applied"
    exec node dist/index.js
  fi
  if [ "$i" -eq "$ATTEMPTS" ]; then
    echo "[backend] ERROR: prisma migrate deploy failed after ${ATTEMPTS} attempts" >&2
    exit 1
  fi
  echo "[backend] migrate not ready yet (attempt ${i}/${ATTEMPTS}), retrying..."
  i=$((i + 1))
  sleep 2
done
