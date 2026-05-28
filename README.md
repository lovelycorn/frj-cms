# FRJ CMS

面向工业外贸官网 + B2B 商城模板场景的前后端分离工程：Next.js 前台 + Strapi CMS + PostgreSQL，统一由 Docker Compose 驱动。

## 技术栈

- Next.js 15 + TypeScript + TailwindCSS
- shadcn/ui 核心组件体系（基于 Radix）
- Framer Motion（微动画）
- Strapi v5
- PostgreSQL 16
- Docker Compose

## 当前阶段交付（工业外贸运营后台一期）

已完成（2026-05）：

- Strapi 数据模型升级：产品中心、内容中心、询盘中心、轻量统计保留层
- 产品中心：`Products/Categories/Industries/Downloads/Certificates`
- 内容中心：`Blog/Case Study/News/FAQ`
- 询盘中心：`Inquiry`（含状态流转 `new/contacted/quoted/closed`）
- 轻量统计：`analytics-event` 事件模型 + `dashboard/overview` 汇总接口
- 前端埋点链路：`page_view / product_click / inquiry_submit`（Strapi + PostHog 可选）
- 管理端中文展示：Strapi Admin locale 配置为中文
- 权限基线：运营看板受保护，内容读与运营读写可通过 API Token 分离
- Docker 编排可用：`docker compose up -d` 可启动 `postgres/strapi/nextjs`

本阶段明确不做：

- AI 插件能力
- SaaS 与多租户
- SEO 中心

## 快速开始（开发）

```bash
cp .env.development.example .env.development
./scripts/dev.sh
```

启动后访问地址以 `.env.development` 为准（默认是 `APP_URL`、`STRAPI_PUBLIC_URL`）。

## 一键部署（生产）

```bash
cp .env.production.example .env.production
# 修改生产密钥后执行
./scripts/deploy-prod.sh
```

## 目录结构

```text
frontend/                 # Next.js 应用
backend/                  # Strapi 应用
deploy/nginx/             # Nginx 配置模板
docs/                     # 文档
scripts/                  # 统一脚本入口
```

## 文档入口

- 部署手册：[docs/deployment.md](docs/deployment.md)
- 开发文档：[docs/development.md](docs/development.md)
- 架构文档：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 变更记录：[docs/CHANGELOG.md](docs/CHANGELOG.md)
- 后端权限基线：[docs/BACKEND_ACCESS_CONTROL.md](docs/BACKEND_ACCESS_CONTROL.md)
- 历史前端升级文档（归档）：`docs/FRONTEND_UI_UPGRADE.md`、`docs/FRONTEND_ACCEPTANCE_CHECKLIST.md`

## 已知问题（当前）

- 联系页询盘存在“偶发前端失败提示但后台已入库”的残留问题，已增加同源 API 代理与确认补偿机制，仍需继续稳定性收敛。

## License

Proprietary (internal project).
