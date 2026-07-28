# Deploy engineerdanyal.com on Vultr (Docker Compose + Nginx + Certbot)

## Architecture

- Docker: Postgres + Express API (`127.0.0.1:4000`) + Next.js (`127.0.0.1:3000`)
- Nginx: public 80/443 → proxies to those ports
- TLS: Let's Encrypt via Certbot

## DNS (before TLS)

Create A records pointing to the VPS IP (`64.177.119.157`):

| Host | Type | Value |
|------|------|-------|
| `@` / `engineerdanyal.com` | A | `64.177.119.157` |
| `www` | A | `64.177.119.157` |
| `api` | A | `64.177.119.157` |

Confirm with `dig +short engineerdanyal.com` — it must return `64.177.119.157` before Certbot will succeed. (A GoDaddy/parking IP means DNS is not pointed at this VPS yet.)

## 1. Server packages

```bash
apt-get update
apt-get install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx

# Docker Engine + Compose plugin (Ubuntu)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
  > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl enable --now docker
```

## 2. Dedicated Linux user + app directory

Host as user `danyalportfolio` (not root):

```bash
# As root once:
adduser --disabled-password --gecos "Portfolio" danyalportfolio
usermod -aG docker danyalportfolio
mkdir -p /home/danyalportfolio/engineerdanyal /var/www/certbot
chown -R danyalportfolio:danyalportfolio /home/danyalportfolio
```

```bash
# Code lives here:
cd /home/danyalportfolio/engineerdanyal
cp .env.production.example .env
# Edit .env — set POSTGRES_PASSWORD, JWT_SECRET, ADMIN_PASSWORD (openssl rand -hex 32)
nano .env
chown danyalportfolio:danyalportfolio .env
```

## 3. Start stack (as danyalportfolio)

```bash
sudo -u danyalportfolio -H bash -lc 'cd /home/danyalportfolio/engineerdanyal && chmod +x run.sh backend/docker-entrypoint.sh && ./run.sh'
```

Migrations run automatically in the backend entrypoint (`prisma migrate deploy`).

## 4. Nginx

```bash
cp /home/danyalportfolio/engineerdanyal/deploy/nginx/engineerdanyal.conf /etc/nginx/sites-available/engineerdanyal
ln -sf /etc/nginx/sites-available/engineerdanyal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 5. TLS

```bash
certbot --nginx -d engineerdanyal.com -d www.engineerdanyal.com -d api.engineerdanyal.com \
  --redirect --agree-tos -m admin@engineerdanyal.com --non-interactive
```

If DNS is not ready yet, skip Certbot and use HTTP smoke tests against the VPS IP with `Host` headers.

## 6. Uploads + optional DB dump

Uploads live in the Docker volume `backend_uploads`. To seed from a local machine:

```bash
# On VPS — copy files into the running backend container
docker compose -f docker/docker-compose.yml --env-file .env cp ./backend/uploads/. backend:/app/uploads/
```

Optional Postgres dump/restore from local:

```bash
# local
pg_dump "$DATABASE_URL" -Fc -f portfolio.dump
# server
docker compose -f docker/docker-compose.yml --env-file .env exec -T db \
  pg_restore -U portfolio -d portfolio --clean --if-exists < portfolio.dump
```

## 7. Smoke tests

```bash
curl -sf http://127.0.0.1:4000/api/health
curl -sf -H 'Host: api.engineerdanyal.com' http://127.0.0.1/api/health
curl -sf -I -H 'Host: engineerdanyal.com' http://127.0.0.1/
# After TLS:
curl -sf https://api.engineerdanyal.com/api/health
curl -sf -I https://engineerdanyal.com/
```

Admin: `https://engineerdanyal.com/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

## Redeploy

```bash
cd /home/danyalportfolio/engineerdanyal
# git pull   # once the repo is on GitHub
./deploy/sync-to-vps.sh root@64.177.119.157 --deploy
```
