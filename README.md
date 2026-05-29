# FRJ CMS v0.2 Baseline

工业外贸官网基础工程（Next.js + Strapi + PostgreSQL + Redis），用于可复制部署的内容站点与询盘管理场景。

## 技术栈

- Frontend: Next.js 15 + TypeScript + TailwindCSS + shadcn/ui
- Backend: Strapi v5
- Database: PostgreSQL 16
- Cache/Infra: Redis 7
- Runtime/Deploy: Docker Compose

## V0.2 基线范围（2026-05-29）

- 前后端全链路可运行：页面、内容接口、询盘提交、轻量埋点
- 询盘提交稳定性修复：
  - 同源提交代理 `POST /api/inquiries/submit`
  - 提交确认补偿 `POST /api/inquiries/confirm`
  - 前端并发提交保护（防多次点击重复提交）
- Docker 默认入口可用：`docker compose up -d`
- 开发/生产编排均包含：`postgres + redis + strapi + nextjs`

## 快速开始（开发）

```bash
cp .env.development.example .env.development
docker compose up -d
```

默认访问：

- Frontend: `http://localhost:3000/en`
- Strapi Admin: `http://localhost:1337/admin`

## 生产部署

```bash
cp .env.production.example .env.production
# 修改所有生产密钥后执行
./scripts/deploy-prod.sh
```

`deploy-prod.sh` 默认包含：预检、`git pull --ff-only`、build、up、容器健康等待、API smoke check。

可选参数：

- `SKIP_GIT_PULL=1 ./scripts/deploy-prod.sh`
- `SKIP_BUILD=1 ./scripts/deploy-prod.sh`
- `SMOKE_CHECK=0 ./scripts/deploy-prod.sh`
- `HEALTH_TIMEOUT=300 ./scripts/deploy-prod.sh`

## 项目结构

```text
frontend/                 # Next.js 应用
backend/                  # Strapi 应用
deploy/nginx/             # Nginx 配置模板
docs/                     # 文档
scripts/                  # 运维脚本
```

## 文档入口

- 部署手册: [docs/deployment.md](docs/deployment.md)
- 开发手册: [docs/development.md](docs/development.md)
- 架构文档: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 权限基线: [docs/BACKEND_ACCESS_CONTROL.md](docs/BACKEND_ACCESS_CONTROL.md)
- 变更记录: [docs/CHANGELOG.md](docs/CHANGELOG.md)

## License

Proprietary (internal project).
