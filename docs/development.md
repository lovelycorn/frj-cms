# FRJ CMS 开发文档

## 1. 技术栈

- Frontend: Next.js 15 + TypeScript + TailwindCSS
- Backend: Strapi v5
- Database: PostgreSQL 16
- Runtime: Node.js 20
- Deploy: Docker Compose

## 2. 工程结构

```text
frj-cms/
├── frontend/                # Next.js
├── backend/                 # Strapi
├── deploy/nginx/            # Nginx 配置模板
├── docs/                    # 文档入口
├── scripts/                 # 统一脚本入口
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.development.example
└── .env.production.example
```

## 3. 业务模块现状（一期）

已完成：

- 产品中心：`Products`、`Categories`、`Industries`、`Downloads`、`Certificates`
- 内容中心：`Blog`、`Case Study`、`News`、`FAQ`
- 询盘中心：`Inquiry` + `POST /api/inquiries/submit`
- 流量与行为统计保留层：
  - `analytics-event`（`page_view/inquiry_submit/product_click/download_click`）
  - `GET /api/dashboard/overview`（轻量运营看板）

当前阶段不做：

- AI
- SaaS
- 多租户
- SEO 中心

## 4. Next.js 结构

- `frontend/app/`: 页面与路由（App Router）
- `frontend/app/api/health/route.ts`: 健康检查接口
- `frontend/app/api/inquiries/submit/route.ts`: 同源询盘提交代理
- `frontend/app/api/inquiries/confirm/route.ts`: 询盘确认补偿接口
- `frontend/app/api/analytics/events/route.ts`: 同源行为事件代理
- `frontend/src/components/`: 组件体系（`ui/layout/sections/commerce/industry/analytics`）
- `frontend/lib/api.ts`: 前端数据访问与询盘提交封装
- `frontend/lib/analytics.ts`: 前端行为事件上报封装
- `frontend/middleware.ts`: i18n 路由处理

## 5. Strapi 结构

- `backend/src/api/`: 内容类型、路由、控制器、服务
- `backend/src/components/`: 复用组件 schema（规格项、UTM 等）
- `backend/src/api/health/`: 健康检查接口
- `backend/scripts/setup-content-api-tokens.js`: API Token 批量初始化脚本

## 6. API 约定（关键）

公开读接口：

- `/api/products`、`/api/categories`、`/api/industries`
- `/api/downloads`、`/api/certificates`
- `/api/blogs`、`/api/case-studies`、`/api/news`、`/api/faqs`
- `/api/global-setting`

公开写接口：

- `POST /api/inquiries/submit`
- `POST /api/inquiries/confirm`
- `POST /api/analytics/events`

受保护接口：

- `GET /api/dashboard/overview`
- 默认 `inquiry` 与 `analytics-event` CRUD

## 7. 环境变量说明

核心变量：

- `APP_URL`: 前端公开地址
- `NEXT_PUBLIC_API_URL`: 浏览器访问 CMS/API 地址
- `STRAPI_PUBLIC_URL`: Strapi 对外地址
- `STRAPI_URL`: Next.js 容器内访问 Strapi 地址
- `POSTGRES_*` / `DATABASE_*`: 数据库配置
- `APP_KEYS`、`API_TOKEN_SALT`、`JWT_SECRET` 等：Strapi 安全密钥
- `ENCRYPTION_KEY`: Strapi Admin 加密密钥
- `ANALYTICS_INGEST_TOKEN`: 可选；启用后 `/api/analytics/events` 需携带 `x-analytics-ingest-token`
- `NEXT_PUBLIC_POSTHOG_KEY`: 可选；配置后前端会上报 PostHog
- `NEXT_PUBLIC_POSTHOG_HOST`: 可选；默认 `https://us.i.posthog.com`

## 8. 本地开发

```bash
cp .env.development.example .env.development
./scripts/dev.sh
```

访问：

- Frontend: 读取 `.env.development` 的 `APP_URL`（默认 `http://localhost:3001`）
- Strapi Admin: `STRAPI_PUBLIC_URL/admin`（默认 `http://localhost:1338/admin`）

## 9. API Token 初始化

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml \
  exec -T strapi node /app/scripts/setup-content-api-tokens.js
```

会创建/更新：

- `frontend-readonly`
- `ops-dashboard`
- `analytics-ingest`

## 10. 验证清单

```bash
# 容器状态
docker compose --env-file .env.development -f docker-compose.dev.yml ps

# 健康检查
curl -s http://127.0.0.1:1338/api/health
curl -s http://127.0.0.1:3001/api/health

# 前端类型检查
cd frontend && npm run typecheck
```

## 11. 已知问题

- 联系页询盘存在“偶发前端失败提示但后台已入库”的残留问题，当前已通过同源代理 + 确认补偿机制缓解，仍在继续收敛。
