# FRJ CMS 开发文档（V0.2）

## 1. 技术栈

- Frontend: Next.js 15 + TypeScript + TailwindCSS + shadcn/ui
- Backend: Strapi v5
- Database: PostgreSQL 16
- Cache/Infra: Redis 7
- Deploy: Docker Compose

## 2. 工程结构

```text
frj-cms/
├── frontend/
├── backend/
├── deploy/nginx/
├── docs/
├── scripts/
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env.development.example
└── .env.production.example
```

## 3. 本地启动

```bash
cp .env.development.example .env.development
docker compose up -d
```

默认访问：

- Frontend: `http://localhost:3000/en`
- Strapi Admin: `http://localhost:1337/admin`

## 4. 核心模块

- 产品中心：`Products`、`Categories`、`Industries`、`Downloads`、`Certificates`
- 内容中心：`Blog`、`Case Study`、`News`、`FAQ`
- 询盘中心：`Inquiry`
- 统计保留层：`analytics-event` + `GET /api/dashboard/overview`

## 5. 关键接口

公开读：

- `/api/products`、`/api/categories`、`/api/industries`
- `/api/downloads`、`/api/certificates`
- `/api/blogs`、`/api/case-studies`、`/api/news`、`/api/faqs`
- `/api/global-setting`

公开写：

- `POST /api/inquiries/submit`
- `POST /api/inquiries/confirm`
- `POST /api/analytics/events`

## 6. 询盘稳定性机制（V0.2）

- 浏览器提交：`/api/inquiries/submit`（Next 同源代理）
- 上游异常补偿：自动调用 `/api/inquiries/confirm` 确认是否已入库
- 前端提交并发保护：防多次点击重复提交

## 7. 开发常用命令

```bash
# 容器状态
docker compose ps

# 健康检查
curl -fsS http://127.0.0.1:3000/api/health
curl -fsS http://127.0.0.1:1337/api/health

# 前端检查
cd frontend
npm run lint
npm run typecheck
```

## 8. API Token 初始化（可选）

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml \
  exec -T strapi node /app/scripts/setup-content-api-tokens.js
```
