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
- 已完成多国家站点配置中心：`frontend/lib/site-config.ts`
- 已完成 i18n 路由层（`/en`、`/de`、`/ja`）与自动语言前缀跳转
- 已完成 `site-config` 与 Strapi `Global Settings` 联动（公司名/联系方式可在 CMS 覆盖）
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

## 多站点配置

新增 `SITE_CODE` 环境变量，当前支持：`us / de / jp`

```env
SITE_CODE=us
```

站点配置集中在：

- `frontend/lib/site-config.ts`
- `frontend/lib/i18n-routing.ts`
- `frontend/middleware.ts`

可配置项包含：

- 品牌名与语言
- Hero 文案
- 联系方式
- 服务区域
- SEO 默认信息
- Locale 前缀路由映射（`en/de/ja`）

## CMS 覆盖规则（已打通）

前端默认读取 `site-config`，并在服务端请求时自动合并 Strapi `Global Settings`：

- `companyName`：覆盖页脚公司名
- `contactInfo`：覆盖联系信息（邮箱/电话/地址/工作时间）

`contactInfo` 推荐两种格式：

1. JSON：
```json
{"email":"sales@example.com","phone":"+86 21 5555 8888","address":"Shanghai, China","workingHours":"Mon - Fri, 09:00 - 18:00 (GMT+8)"}
```

2. 文本键值：
```text
Email: sales@example.com | Phone: +86 21 5555 8888 | Address: Shanghai, China | WorkingHours: Mon - Fri, 09:00 - 18:00 (GMT+8)
```

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
