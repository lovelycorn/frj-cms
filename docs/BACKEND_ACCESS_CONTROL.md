# Backend Access Control Baseline

## 1. Goals

- Keep public website content APIs readable without login.
- Keep operations dashboard data protected.
- Keep analytics ingestion open by default, but support token gate when needed.
- Avoid heavy plugin dependency and keep policy maintainable.

## 2. Public endpoints (no auth)

- `GET /api/health`
- `GET /api/products` and `GET /api/products/:id`
- `GET /api/categories` and `GET /api/categories/:id`
- `GET /api/industries` and `GET /api/industries/:id`
- `GET /api/downloads` and `GET /api/downloads/:id`
- `GET /api/certificates` and `GET /api/certificates/:id`
- `GET /api/blogs` and `GET /api/blogs/:id`
- `GET /api/case-studies` and `GET /api/case-studies/:id`
- `GET /api/news` and `GET /api/news/:id` (`/api/news-list` also available)
- `GET /api/faqs` and `GET /api/faqs/:id`
- `GET /api/global-settings`
- `POST /api/inquiries/submit`
- `POST /api/analytics/events`

## 3. Protected endpoints (auth required)

- `GET /api/dashboard/overview`
- default CRUD routes for `inquiry` and `analytics-event`

`dashboard/overview` no longer uses `auth: false`, so requests need valid Strapi auth (for example API Token).

## 4. Analytics ingestion token gate

- Env var: `ANALYTICS_INGEST_TOKEN`
- Behavior:
  - If not set: `POST /api/analytics/events` keeps current public behavior.
  - If set: request must include header `x-analytics-ingest-token: <token>`.

This is implemented in `backend/src/api/analytics-event/controllers/analytics-event.js`.

## 5. API Token strategy

Create separate Strapi API Tokens in Admin:

- `frontend-readonly`:
  - Allow only public read actions needed by frontend (`find/findOne` on content APIs).
  - Do not grant inquiry list/update permissions.
- `ops-dashboard`:
  - Allow `GET /api/dashboard/overview`.
  - Allow inquiry read/update actions for sales follow-up.
- `analytics-ingest`:
  - Use only when server-side ingestion is needed.
  - Pair with `ANALYTICS_INGEST_TOKEN`.

## 6. Role split recommendation (Admin panel)

- Content Editor: manage products, categories, blog, case studies, news, faq.
- Sales Operator: manage inquiries and status updates.
- Analyst: view dashboard and event summaries, no content write.

## 7. Quick verification

```bash
# should be 401/403 without auth
curl -i http://127.0.0.1:1338/api/dashboard/overview

# with ingest token set, should pass only when header is provided
curl -i -X POST http://127.0.0.1:1338/api/analytics/events \
  -H 'Content-Type: application/json' \
  -H 'x-analytics-ingest-token: <token>' \
  -d '{"data":{"event_name":"page_view"}}'
```
