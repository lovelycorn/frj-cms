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

## 3. Next.js 结构

- `frontend/app/`: 页面与路由（App Router）
- `frontend/app/api/health/route.ts`: 前端健康检查接口
- `frontend/components/`: 页面组件
- `frontend/lib/api.ts`: Strapi 请求封装
- `frontend/lib/site-config.ts`: 站点配置
- `frontend/middleware.ts`: i18n 路由处理

## 4. Strapi 结构

- `backend/src/api/`: 内容类型、路由、控制器、服务
- `backend/config/`: 数据库与服务配置
- `backend/src/components/`: 复用组件 schema
- `backend/src/api/health/`: 后端健康检查接口

## 5. Docker 结构

- `docker-compose.dev.yml`: 开发编排
- `docker-compose.prod.yml`: 生产编排
- `frontend/Dockerfile*`: Next.js 开发/生产镜像
- `backend/Dockerfile*`: Strapi 开发/生产镜像

## 6. Nginx 结构

- `deploy/nginx/frj-cms.conf.example`: 反向代理模板
- 生产可通过该模板代理到 Next.js 与 Strapi

## 7. API 结构

- Strapi API 前缀：`/api/*`
- 自定义健康接口：`/api/health`
- 前端通过 `NEXT_PUBLIC_API_URL` 与 `STRAPI_URL` 访问 Strapi

## 8. 页面结构

- `/`: 首页
- `/about`: 关于页
- `/products`: 产品列表
- `/products/[slug]`: 产品详情
- `/contact`: 联系页

## 9. 数据流

1. 浏览器请求 Next.js 页面。
2. Next.js server/component 调用 `frontend/lib/api.ts`。
3. API 请求发往 Strapi（容器内优先 `STRAPI_URL`）。
4. Strapi 查询 PostgreSQL 返回 JSON。
5. Next.js 渲染页面并返回给浏览器。

## 10. 环境变量说明

核心变量：

- `SITE_CODE`: 站点代码
- `APP_URL`: 前端公开地址
- `NEXT_PUBLIC_API_URL`: 浏览器访问 CMS/API 地址
- `STRAPI_PUBLIC_URL`: Strapi 对外地址
- `STRAPI_URL`: Next.js 容器内访问 Strapi 地址
- `POSTGRES_*` / `DATABASE_*`: 数据库配置
- `APP_KEYS` 等：Strapi 安全密钥

## 11. 本地开发方式

```bash
cp .env.development.example .env.development
./scripts/dev.sh
```

访问：

- Frontend: `http://localhost:3000`
- Strapi Admin: `http://localhost:1337/admin`

## 12. 构建流程

开发构建由 `docker-compose.dev.yml` 驱动。
生产构建由 `docker-compose.prod.yml` 驱动，执行入口为 `./scripts/deploy-prod.sh`。

## 13. 部署流程

1. 准备 `.env.production`
2. 执行 `./scripts/deploy-prod.sh`
3. 查看 `docker compose ... ps`
4. 查看 `./scripts/logs.sh`

## 14. 目录说明

- `frontend/public/`: 静态资源
- `backend/public/uploads/`: Strapi 上传目录（生产卷持久化）
- `scripts/backup.sh`: PostgreSQL 备份
- `scripts/restore.sh`: PostgreSQL 恢复
- `scripts/logs.sh`: 统一日志入口

## 15. 核心模块说明

- `site-config`: 多站点配置聚合
- `i18n-routing`: 多语言路径管理
- `global-setting`: Strapi 全局配置内容类型
- `product/article/category`: 核心内容模型
