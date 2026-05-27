# 开发文档

## 1. 架构说明

当前为单站独立部署形态：

- `frontend`：品牌站前端（Next.js 15 + Tailwind + TS）
- `backend`：内容管理（Strapi v5）
- `postgres`：业务数据存储

每个站点可独立复制一套，后续可抽离为多站复用模块。

## 2. 前端模块

核心目录：

- `app/`：路由与页面
- `components/`：通用组件（Header/Footer/Hero/ProductCard 等）
- `lib/api.ts`：Strapi API 封装
- `lib/site-config.ts`：多国家站点配置中心
- `lib/i18n-routing.ts`：语言路由与路径处理
- `middleware.ts`：locale 路由重写与默认语言跳转
- `types/`：业务类型定义

API 方法：

- `getProducts`
- `getProductBySlug`
- `getCategories`
- `getArticles`

站点配置方法：

- `getSiteConfig`
- `resolveSiteCode`
- `getSupportedSiteCodes`

i18n 路由规则：

- 支持路径前缀：`/en`、`/de`、`/ja`
- 无前缀路径将自动重定向到默认 locale
- `/_next`、`/api`、`/admin`、`robots/sitemap` 等路径跳过 locale 重写

## 3. 后端模块

Strapi 内容类型：

- Product
- Category
- Article
- Global Settings

补充说明：

- 已补齐 controller/service 工厂文件，避免 `GET /articles` 路由注册异常。
- `src/index.js` 含启动初始化（默认管理员 + 初始示例数据）。

## 4. 开发规范

- TypeScript 严格模式，不使用 `any`
- 组件化优先，接口边界清晰
- `docs/` 与代码变更同步更新
- 环境变量统一由 `.env` 注入
- 跨国家站点差异优先在 `site-config` 中抽离，不直接写死到页面

## 5. 常用命令

```bash
# 启动开发环境
docker compose --profile dev up --build

# 查看服务状态
docker compose ps

# 查看 Strapi 日志
docker compose logs -f strapi

# 停止服务
docker compose --profile dev down
```
