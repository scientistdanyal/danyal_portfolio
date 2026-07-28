# engineerdanyal.com

Monorepo for the full-stack engineer portfolio site.

## Structure

```
/frontend   Next.js (public site + admin UI)
/backend    Express API + Prisma
/docker     Dockerfiles + compose configs
/deploy     VPS Nginx, bootstrap, sync scripts
run.sh      Production Docker deployment entrypoint
```

## Prerequisites

- Node.js 22+
- Docker + Docker Compose
- npm

## Quick start (local)

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Postgres: local install on :5432 is used by default (DATABASE_URL in .env).
# If you prefer Docker Postgres instead, free :5432 first, then:
#   npm run dev:db

# Apply migrations (from /backend)
npm --prefix backend run prisma:migrate

# In separate terminals:
npm run dev:backend
npm run dev:frontend
```

- Frontend: http://localhost:3000  
- Backend health: http://localhost:4000/api/health  

## Production (VPS)

See **[deploy/DEPLOY.md](deploy/DEPLOY.md)** for DNS, Docker, Nginx, and Certbot.

Quick path from your laptop:

```bash
chmod +x deploy/sync-to-vps.sh deploy/bootstrap-vps.sh
# Syncs into /home/danyalportfolio/engineerdanyal and runs compose as that user
./deploy/sync-to-vps.sh root@64.177.119.157 --deploy
# Then on the server (when DNS is ready):
# certbot --nginx -d engineerdanyal.com -d www.engineerdanyal.com -d api.engineerdanyal.com
```

Production env template: [`.env.production.example`](.env.production.example)

## Full stack via Docker (local/prod machine)

```bash
cp .env.production.example .env   # or .env.example for local defaults
# Edit secrets / NEXT_PUBLIC_API_URL as needed
./run.sh
```

## Specs

- `SECTIONS.md` — content schema
- `DESIGN.md` — visual identity
- `INSTRUCTIONS.md` — architecture & build order
