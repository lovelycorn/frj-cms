# Frontend Acceptance Checklist

## Phase Result (2026-05-28)

- Status: passed
- Scope: frontend UI architecture upgrade + compose runtime validation
- Runtime: `postgres` / `strapi` / `nextjs` all healthy in `docker-compose.dev.yml`

## Preconditions

- Node runtime compatible with Next.js 15 (`>=18.18`)
- Dependencies installed in `frontend/`
- Local env files present when running compose scripts

## Frontend checks

Run in `frontend/`:

```bash
npm run typecheck
npm run lint
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Expected:

- TypeScript check passes
- Lint passes with zero errors/warnings
- Dev server starts and serves the port configured by `APP_URL` / `NEXT_PORT`

## Functional checks

- Header desktop mega menu opens and links are clickable
- Header mobile sheet menu opens/closes normally
- Floating inquiry desktop buttons work
- Floating mobile inquiry bar appears on small screens
- Product list category tabs switch category query correctly
- Product detail page renders gallery/specification/related products
- Contact form submit feedback appears after submit

## API / Runtime checks

- `GET /api/health` on Next.js returns `200`
- `GET /api/health` on Strapi returns `200`
- Product API endpoint responds `200` (`/api/products`)

## Compose checks

From repo root:

```bash
docker compose -f docker-compose.dev.yml config -q
```

Expected:

- Compose config validates successfully
- If failing due to missing env file, create it first:

```bash
cp .env.development.example .env.development
```

## Non-regression constraints

- No backend schema changes required for frontend render
- No Docker topology changes
- No PostgreSQL configuration changes
- Existing route structure preserved
