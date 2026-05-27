# FRJ CMS - 外贸独立站模板（Phase 1）

面向单站独立部署的外贸官网模板，支持后续平滑演进到多站点与中心化系统。

技术栈：

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Strapi v5
- PostgreSQL
- Docker Compose

## 当前稳定版本状态（2026-05-27）

本轮已完成“生产测试稳定版”增强：

- 完成前后端探活接口：
- Next.js: `/api/health`
- Strapi: `/api/health`
- 完成 Docker 生产编排加固：
- `depends_on` 基于 `service_healthy`
- `strapi-prod` 增加上传目录持久化 `strapi_uploads`
- 所有核心服务增加健康检查与日志轮转
- 完成镜像构建稳定性增强：
- 前后端生产 Dockerfile 改为 `npm ci`
- 新增 `frontend/.dockerignore` 与 `backend/.dockerignore`
- 完成运维脚本：
- `scripts/smoke-check.sh`
- `scripts/ops/backup-postgres.sh`
- `scripts/ops/restore-postgres.sh`
- 完成开发/生产环境分离：
- `docker-compose.dev.yml`
- `docker-compose.prod.yml`
- `.env.development.example`
- `.env.production.example`

## 文档导航

- 开发文档：[docs/development.md](docs/development.md)
- 通用部署文档：[docs/deployment.md](docs/deployment.md)
- Ubuntu 24.04 LTS 生产部署手册：[docs/deployment-ubuntu-24.04.md](docs/deployment-ubuntu-24.04.md)
- CentOS 7.9 历史部署文档（不再推荐新生产环境使用）：[docs/deployment-centos7.md](docs/deployment-centos7.md)
- 项目计划：[docs/project-plan.md](docs/project-plan.md)
- 进度说明：[docs/progress.md](docs/progress.md)

## 项目结构

```text
frontend/               # Next.js 站点
backend/                # Strapi CMS
docs/                   # 项目文档
scripts/                # 运维与验收脚本
.env.development.example # macOS 开发环境变量模板
.env.production.example # 生产环境变量模板
docker-compose.dev.yml  # macOS 开发环境编排
docker-compose.prod.yml # Ubuntu 生产环境编排
```

## 快速启动（开发）

适用：macOS M2 Pro / 16GB / 1TB。

```bash
cp .env.development.example .env.development
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```

访问：

- Frontend: [http://localhost:3000](http://localhost:3000)
- Strapi Admin: [http://localhost:1337/admin](http://localhost:1337/admin)

## 快速启动（生产测试）

推荐生产系统：Ubuntu Server 24.04 LTS x86_64。完整部署流程见 [docs/deployment-ubuntu-24.04.md](docs/deployment-ubuntu-24.04.md)。

```bash
cp .env.production.example .env.production
# 修改 .env.production 中所有密钥、密码、域名

docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

访问：

- Frontend: `https://www.example.com`
- Strapi Admin: `https://cms.example.com/admin`

## 健康检查与验收

服务健康检查接口：

- Next.js: `GET /api/health`
- Strapi: `GET /api/health`

一键 smoke 检查：

```bash
./scripts/smoke-check.sh
```

自定义地址：

```bash
FRONTEND_URL=http://localhost:3000 STRAPI_URL=http://localhost:1337 ./scripts/smoke-check.sh
```

## 数据备份与恢复

备份 PostgreSQL：

```bash
./scripts/ops/backup-postgres.sh
```

恢复 PostgreSQL：

```bash
./scripts/ops/restore-postgres.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

## 多站点配置

通过 `SITE_CODE` 切换站点基础配置：

```env
SITE_CODE=us
```

当前支持：`us / de / jp`

核心文件：

- `frontend/lib/site-config.ts`
- `frontend/lib/i18n-routing.ts`
- `frontend/middleware.ts`

## 默认管理员

- Email: `admin@example.com`
- Password: `Admin123456!`

仅用于首次初始化，生产环境请在 `.env.production` 中替换。

## 安全建议（生产必做）

- 替换所有 Strapi 密钥与默认管理员密码
- 限制 `5432` 仅内网访问（或不对公网开放）
- 反向代理接入 HTTPS（Nginx/Caddy）
- 建立定时备份与异地备份策略

## 常见问题

1. 拉取镜像超时（`auth.docker.io ... i/o timeout`）

在 `.env.development` 或 `.env.production` 里配置：

```env
NODE_IMAGE=m.daocloud.io/docker.io/library/node:20-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

2. Strapi 启动报 `getaddrinfo ENOTFOUND postgres`

确认运行命令在项目根目录，并使用 compose 网络：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml down --remove-orphans
docker compose --env-file .env.development -f docker-compose.dev.yml up --build --force-recreate
```
