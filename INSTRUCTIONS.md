# Portfolio Website — Build Instructions

Reference: see `sections.md` for the content/data schema (Portfolio, Skills & Certifications, Projects, Experience, Blogs, Contact). This document covers architecture, tech stack, admin panel, deployment, and security requirements.

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js + React |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL (relational data) + a document store for flexible/nested content (e.g. blog body, case-study details, screenshots) — evaluate whether Postgres `jsonb` columns are sufficient before adding a separate document DB |
| Admin Panel | Custom-built (see Section 3) |
| Domain | engineerdanyal.com |
| CI/CD | Pipeline (GitHub Actions recommended) |
| Containerization | Docker + docker-compose |
| Deployment | `run.sh` script (see Section 6) |

---

## 2. Architecture & Project Structure

Monorepo layout recommended:

```
/frontend      → Next.js app (public site + admin UI)
/backend       → Express API + Prisma schema
/docker        → Dockerfiles, compose configs
/.github/workflows → CI/CD pipeline definitions
run.sh         → deployment entrypoint
sections.md    → content schema reference
instructions.md → this file
```

**Backend**
- REST (or GraphQL, if preferred) API exposing CRUD endpoints for each content type in `sections.md`: projects, experience, certifications, skills, blogs, contact submissions.
- Prisma schema modeled directly from `sections.md` field tables.
- Layered structure: `routes/ → controllers/ → services/ → prisma/` — keep business logic out of route handlers.

**Frontend**
- Public-facing pages: Portfolio/Home, Skills & Certifications, Projects/Case Studies, Experience, Blogs, Contact.
- Admin section under `/admin`, auth-protected (see Section 3).
- Use static generation (ISR) for public content where possible for performance/SEO; admin routes stay fully dynamic.

---

## 3. Admin Panel

Authenticated area for managing all content. Must support:

- [ ] Add/edit/delete **projects** (including case-study details, screenshots)
- [ ] Add/edit/delete **experience** entries
- [ ] Add/edit/delete **certifications**
- [ ] Add/edit/delete **skills** (by category)
- [ ] Add/edit/delete **blog posts** (including code sections, images)
- [ ] Upload/replace **resume** file
- [ ] View **contact form submissions**

Requirements:
- Authentication required (single-admin login is fine — email/password with hashed passwords via bcrypt, or a magic-link flow).
- Session handling via secure, httpOnly cookies or JWT with short expiry + refresh token.
- File/image uploads validated (type, size limit) before storage.

---

## 4. Security Setup

- **Rate limiting**: apply per-IP request limits on all public API routes (e.g. `express-rate-limit`), with stricter limits on the contact form and admin login endpoints to prevent brute-force/spam.
- **DDoS mitigation**: put the site behind a CDN/reverse proxy (e.g. Cloudflare) in front of the origin server; enable basic bot/challenge protection at that layer rather than relying solely on app-level throttling.
- **Input validation & sanitization**: validate all incoming payloads (e.g. `zod` or `express-validator`); sanitize any rendered user-generated content to prevent XSS.
- **SQL/NoSQL injection protection**: Prisma parameterizes queries by default — avoid raw queries unless necessary, and sanitize inputs if raw queries are unavoidable.
- **CORS**: restrict allowed origins to the production domain (and localhost in dev).
- **Headers**: set standard security headers (`helmet` in Express) — HSTS, X-Content-Type-Options, X-Frame-Options, CSP.
- **Secrets management**: no credentials in source control; use `.env` files locally and a secrets manager or CI/CD secrets store in production.
- **HTTPS only**: enforce TLS on the domain; redirect all HTTP traffic to HTTPS.
- **Admin route protection**: admin endpoints require authentication middleware on every route, not just the UI layer.
- **Dependency hygiene**: run `npm audit` (or equivalent) in CI; keep dependencies patched.

---

## 5. CI/CD Pipeline

- Trigger on push/PR to `main`.
- Pipeline stages:
  1. Install dependencies
  2. Lint + type-check
  3. Run tests
  4. Build Docker images (frontend + backend)
  5. Push images to registry
  6. Deploy (trigger `run.sh` on the target server, or deploy via the hosting platform's CLI)
- Fail the pipeline on lint/test/build errors — no deploys on a broken build.

---

## 6. Dockerization & Deployment

- Separate `Dockerfile` for frontend and backend; multi-stage builds to keep images small.
- `docker-compose.yml` for local dev: frontend, backend, Postgres, (and document store if used).
- **`run.sh`** should handle:
  - Pulling latest code/images
  - Running Prisma migrations
  - Building and starting containers
  - Basic health check after startup
  - Clear logging of each step, and a non-zero exit code on failure

---

## 7. Development Principles

- Write clean, human-readable code with consistent naming and comments where logic isn't self-evident.
- Keep components/functions small and single-purpose.
- Structure the codebase so new sections/content types can be added without touching unrelated code (scalable, maintainable).
- Use TypeScript across frontend and backend for type safety.
- Add basic automated tests (unit tests for backend services, at minimum) before considering a feature complete.

---

## 8. Step-by-Step Build Order

1. Scaffold monorepo structure and Docker setup.
2. Define Prisma schema from `sections.md` and run initial migration.
3. Build backend CRUD API for all content types + contact form endpoint.
4. Add security middleware (rate limiting, helmet, CORS, validation) to backend.
5. Build admin authentication + admin panel UI (CRUD for all sections, resume upload).
6. Build public-facing Next.js pages consuming the API (Portfolio, Skills & Certifications, Projects, Experience, Blogs, Contact).
7. Write `run.sh` and verify local deployment via Docker Compose.
8. Set up CI/CD pipeline (lint, test, build, deploy).
9. Configure domain (engineerdanyal.com), TLS, and CDN/reverse proxy.
10. Final security pass and load test before going live.
11. Don't do everything at once.