# FRJ CMS

面向外贸官网场景的前后端分离工程模板：Next.js 前台 + Strapi CMS + PostgreSQL，基于 Docker Compose 运行。

## 技术栈

- Next.js 15 + TypeScript + TailwindCSS
- Strapi v5
- PostgreSQL 16
- Docker Compose

## 系统截图（占位）

- 首页截图：`docs/assets/homepage.png`（待补）
- CMS 后台截图：`docs/assets/strapi-admin.png`（待补）

## 快速开始

```bash
cp .env.development.example .env.development
./scripts/dev.sh
```

## 一键部署

```bash
cp .env.production.example .env.production
# 修改生产密钥后执行
./scripts/deploy-prod.sh
```

## 开发指南

详见：[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)

## 项目结构

```text
frontend/                 # Next.js 应用
backend/                  # Strapi 应用
deploy/nginx/             # Nginx 配置模板
docs/                     # 文档
scripts/                  # 统一脚本入口
```

## 核心模块

- `frontend/lib/site-config.ts`: 站点配置
- `frontend/lib/i18n-routing.ts`: 多语言路由
- `backend/src/api/global-setting`: 全局配置内容类型
- `backend/src/api/product|article|category`: 内容模型

## 当前进展

- 生产环境可运行（Docker Compose）
- 部署入口已统一为 `scripts/deploy-prod.sh`
- 文档体系已收敛为 4 份核心文档

## 下一步计划

1. 补充自动化测试（接口 + 页面）
2. 增加 CI 流程（lint/typecheck/build）
3. 完善生产备份轮转与告警

## 文档入口

- 部署文档：[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- 开发文档：[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- 架构文档：[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- 变更记录：[docs/CHANGELOG.md](docs/CHANGELOG.md)

## License

Proprietary (internal project).
