# macOS 开发环境文档

适用环境：macOS，Apple Silicon（M2 Pro），16GB RAM / 1TB SSD。

## 1. 开发环境边界

开发环境使用独立文件：

- Compose：`docker-compose.dev.yml`
- 环境变量模板：`.env.development.example`
- 本机环境变量文件：`.env.development`

开发服务：

- `nextjs`：Next.js 开发服务，支持热更新
- `strapi`：Strapi develop 模式，支持后台调试
- `postgres`：本地开发数据库

开发环境不会使用生产 Compose 和生产环境变量。

## 2. 本机准备

安装：

- Docker Desktop for Mac（Apple Silicon 版本）
- Git

Docker Desktop 建议资源：

- CPU：4 Core 或以上
- Memory：8GB 左右
- Disk：至少 20GB 可用空间

## 3. 快速启动

```bash
cp .env.development.example .env.development
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```

访问：

- Frontend: `http://localhost:3000`
- Strapi Admin: `http://localhost:1337/admin`

默认管理员：

- Email: `admin@example.com`
- Password: `Admin123456!`

## 4. 健康检查

```bash
curl -s http://localhost:3000/api/health
curl -s http://localhost:1337/api/health
./scripts/smoke-check.sh
```

## 5. 常用命令

后台启动：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build -d
```

查看服务：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml ps
```

查看日志：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml logs -f nextjs
docker compose --env-file .env.development -f docker-compose.dev.yml logs -f strapi
docker compose --env-file .env.development -f docker-compose.dev.yml logs -f postgres
```

停止服务：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml down
```

清空开发数据库和缓存卷：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml down -v
```

## 6. 代码结构

前端核心目录：

- `frontend/app/`：Next.js App Router 页面和 API route
- `frontend/components/`：通用组件
- `frontend/lib/api.ts`：Strapi API 封装
- `frontend/lib/site-config.ts`：多国家站点配置中心
- `frontend/lib/i18n-routing.ts`：语言路由与路径处理
- `frontend/middleware.ts`：locale 路由重写与默认语言跳转

后端核心目录：

- `backend/src/api/`：Strapi API 内容类型、controller、service、route
- `backend/src/components/`：Strapi 组件 schema
- `backend/config/`：Strapi 数据库、中间件、服务配置
- `backend/src/index.js`：启动初始化逻辑

## 7. 开发规则

- 开发环境只改 `.env.development`，不要把真实生产密钥写入开发文件。
- 本地调试优先使用 `docker-compose.dev.yml`，不要使用生产 Compose。
- 修改依赖后重新执行 `docker compose --env-file .env.development -f docker-compose.dev.yml up --build`。
- 若页面无数据，先确认 Strapi Public 权限是否开放对应内容类型的 `find/findOne`。

## 8. 开发环境排障

端口被占用：

```bash
lsof -i :3000
lsof -i :1337
lsof -i :5432
```

可以在 `.env.development` 中调整：

```env
NEXT_PORT=3001
STRAPI_PORT=1338
POSTGRES_PORT=5433
```

Apple Silicon 镜像构建慢：

```env
NODE_IMAGE=node:20-alpine
POSTGRES_IMAGE=postgres:16-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

重建：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build --force-recreate
```
