# FRJ CMS - 外贸独立站模板（Phase 1）

面向单站独立部署的外贸官网模板，支持后续平滑演进到多站点与中心化系统。

技术栈：

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Strapi v5
- PostgreSQL
- Docker Compose

## 当前工程状态（2026-05-27）

- 已完成前后端基础架构搭建：`frontend + backend + postgres`
- 已完成页面模板：Home / Products / Product Detail / About / Contact
- 已完成 Strapi 内容模型：Product / Category / Article / Global Settings
- 已完成 SEO 基础能力：metadata、OpenGraph、sitemap、robots、动态 title/description
- 已完成 Docker 开发/生产 Profile 配置
- 已验证运行：
  - `http://localhost:3000` 前端可访问
  - `http://localhost:1337/admin` Strapi 后台可访问

## 文档导航

- 开发文档：[docs/development.md](docs/development.md)
- 部署文档：[docs/deployment.md](docs/deployment.md)
- 项目计划：[docs/project-plan.md](docs/project-plan.md)
- 进度说明：[docs/progress.md](docs/progress.md)

## 项目结构

```text
frontend/               # Next.js 站点
backend/                # Strapi CMS
docs/                   # 项目文档
.env.example            # 环境变量模板
docker-compose.yml      # 容器编排
```

## 快速启动（开发环境）

```bash
cp .env.example .env
docker compose --profile dev up --build
```

访问地址：

- Frontend: [http://localhost:3000](http://localhost:3000)
- Strapi Admin: [http://localhost:1337/admin](http://localhost:1337/admin)
- Strapi API: [http://localhost:1337/api/products](http://localhost:1337/api/products)

## 默认管理员

- Email: `admin@example.com`
- Password: `Admin123456!`

生产环境请务必在 `.env` 中替换。

## 生产启动

```bash
docker compose --profile prod up --build -d
```

## 网络超时兼容（Docker Hub 拉取慢）

若构建时出现 `auth.docker.io ... i/o timeout`，可在 `.env` 中使用：

```env
NODE_IMAGE=m.daocloud.io/docker.io/library/node:20-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

然后重建：

```bash
docker compose --profile dev down --remove-orphans
docker compose --profile dev up --build --force-recreate
```
