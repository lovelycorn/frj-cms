# FRJ CMS

面向工业外贸官网 + B2B 商城模板场景的前后端分离工程：Next.js 前台 + Strapi CMS + PostgreSQL，统一由 Docker Compose 驱动。

## 技术栈

- Next.js 15 + TypeScript + TailwindCSS
- shadcn/ui 核心组件体系（基于 Radix）
- Framer Motion（微动画）
- Strapi v5
- PostgreSQL 16
- Docker Compose

## 本阶段（前端 UI 体系升级）完成情况

- 已完成 `frontend/src` 组件化架构重建（`ui/layout/sections/commerce/industry`）
- 已完成 P0 模块重构：`Header`、`Hero`、`Product Showcase`、`Industry Solutions`、`Factory Strength`、`Inquiry CTA`、`Footer`、`Mobile Navigation`
- 已完成产品系统组件：`Product Grid/Card/Detail/Gallery/Specification/Related`
- 已完成询盘系统入口统一：头部、页脚、悬浮询盘、移动端 WhatsApp CTA、联系页表单
- 已完成接口兼容：产品规格多形态字段映射（不改 Strapi 数据模型）
- 已完成验收：Docker 开发环境可运行，核心页面与健康接口通过

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
- 前端升级交付：[docs/FRONTEND_UI_UPGRADE.md](docs/FRONTEND_UI_UPGRADE.md)
- 前端验收清单：[docs/FRONTEND_ACCEPTANCE_CHECKLIST.md](docs/FRONTEND_ACCEPTANCE_CHECKLIST.md)

## License

Proprietary (internal project).
