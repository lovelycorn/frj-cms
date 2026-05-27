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
- 完成生产环境模板：
- `.env.production.example`

## 文档导航

- 开发文档：[docs/development.md](docs/development.md)
- 通用部署文档：[docs/deployment.md](docs/deployment.md)
- CentOS 7.9 部署文档：[docs/deployment-centos7.md](docs/deployment-centos7.md)
- 项目计划：[docs/project-plan.md](docs/project-plan.md)
- 进度说明：[docs/progress.md](docs/progress.md)

## 项目结构

```text
frontend/               # Next.js 站点
backend/                # Strapi CMS
docs/                   # 项目文档
scripts/                # 运维与验收脚本
.env.example            # 开发环境变量模板
.env.production.example # 生产环境变量模板
docker-compose.yml      # 容器编排（dev/prod profile）
```

## 快速启动（开发）

```bash
cp .env.example .env
docker compose --profile dev up --build
```

访问：

- Frontend: [http://localhost:3000](http://localhost:3000)
- Strapi Admin: [http://localhost:1337/admin](http://localhost:1337/admin)

## 快速启动（生产测试）

```bash
cp .env.production.example .env
# 修改 .env 中所有密钥、密码、域名

docker compose --profile prod up --build -d
```

访问：

- Frontend: `http://<server-ip>:3000`
- Strapi Admin: `http://<server-ip>:1337/admin`

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

仅用于首次初始化，生产环境请在 `.env` 中替换。

## 安全建议（生产必做）

- 替换所有 Strapi 密钥与默认管理员密码
- 限制 `5432` 仅内网访问（或不对公网开放）
- 反向代理接入 HTTPS（Nginx/Caddy）
- 建立定时备份与异地备份策略

## 常见问题

1. 拉取镜像超时（`auth.docker.io ... i/o timeout`）

在 `.env` 里配置：

```env
NODE_IMAGE=m.daocloud.io/docker.io/library/node:20-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

2. Strapi 启动报 `getaddrinfo ENOTFOUND postgres`

确认运行命令在项目根目录，并使用 compose 网络：

```bash
docker compose --profile dev down --remove-orphans
docker compose --profile dev up --build --force-recreate
```
