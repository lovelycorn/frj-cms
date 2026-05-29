# Changelog

## v0.2 (2026-05-29)

### Added

- 默认编排入口 `docker-compose.yml`，支持直接 `docker compose up -d`。
- 开发/生产编排新增 `redis` 服务（`redis:7-alpine`）。
- `scripts/deploy-prod.sh` 增强：
  - 必填生产配置与密钥占位校验
  - 容器健康等待
  - Next/Strapi `api/health` smoke check
  - 可选参数：`SKIP_GIT_PULL`、`SKIP_BUILD`、`SMOKE_CHECK`、`HEALTH_TIMEOUT`

### Changed

- 询盘链路稳定性修复：
  - `POST /api/inquiries/submit` 增加服务端确认补偿（上游失败但已入库时返回成功）
  - 联系页提交增加并发锁，防多次点击重复提交
  - 客户端确认重试增强（次数与无缓存请求）
- 文档基线重构为 V0.2：
  - `README.md`
  - `docs/DEPLOYMENT.md`
  - `docs/DEVELOPMENT.md`
  - `docs/ARCHITECTURE.md`

### Removed

- 删除文档中的过期残留描述（旧端口默认值、已修复的询盘失败说明、重复部署步骤）。

## 2026-05-29

### Added

- 新增 Next.js 同源代理接口：
  - `POST /api/inquiries/submit`
  - `POST /api/inquiries/confirm`
  - `POST /api/analytics/events`
- 新增后端询盘确认接口 `POST /api/inquiries/confirm`，用于提交异常时的补偿确认。
- 新增行为事件与询盘链路相关的前端跟踪模块（`frontend/lib/analytics.ts`、`frontend/src/components/analytics/*`）。
- 新增 API Token 自动化脚本：`backend/scripts/setup-content-api-tokens.js`。

### Changed

- `README.md` 从“前端 UI 升级阶段”更新为“工业外贸运营后台一期”真实状态描述。
- `docs/development.md` 重写为当前有效的开发手册，补齐产品/内容/询盘/统计模块说明。
- `docs/BACKEND_ACCESS_CONTROL.md` 修正公开接口描述（`/api/global-setting`）并补充询盘确认端点。
- 导航 Mega Menu 渲染结构调整，修复顶部菜单显示不全/遮挡问题。

### Removed

- 删除 README 中已过期的“本阶段仅前端 UI 升级”表述与无效文档入口指引。

### Notes

- 联系页询盘仍存在“偶发前端失败提示但后台已入库”的残留问题，已增加同源代理与确认补偿机制，后续继续收敛。

## 2026-05-28

### Added

- 新增前端升级交付文档：`docs/FRONTEND_UI_UPGRADE.md`。
- 新增前端验收清单文档：`docs/FRONTEND_ACCEPTANCE_CHECKLIST.md`。

### Changed

- 前端完成 `shadcn/ui` 核心体系重构，建立 `frontend/src/components/{ui,layout,sections,commerce,industry}` 分层目录。
- 首页与核心路由切换到新组件体系，完成工业外贸风格 UI 升级。
- 产品系统完成模板化组件重构（列表、卡片、详情、规格、图集、相关推荐）。
- 询盘系统入口统一（头部、页脚、悬浮按钮、移动端 WhatsApp、联系页）。
- `README.md` 更新为本阶段真实交付状态与文档入口。

### Removed

- 删除旧版页面组件文件（`frontend/components/CTASection.tsx`、`ContactForm.tsx`、`Footer.tsx`、`Header.tsx`、`Hero.tsx`、`ProductCard.tsx`、`ProductGrid.tsx`）。
- 清理过期阶段文档 `release-v0.1.md`。

### Notes

- 本次前端升级未修改 Docker 拓扑、Strapi 数据模型、PostgreSQL 配置结构与部署入口脚本。
- 已完成开发编排环境验收：`postgres`、`strapi`、`nextjs` 容器均可健康启动。

## 2026-05-27

### Changed

- 统一脚本入口，生产部署收敛到 `scripts/deploy-prod.sh`。
- 新增标准化运维脚本：`scripts/dev.sh`、`scripts/backup.sh`、`scripts/restore.sh`、`scripts/logs.sh`。
- 重构文档体系并统一入口。

### Removed

- 删除历史/重复部署文档与阶段性临时文档。
- 删除 `scripts/ops/*` 与 `scripts/smoke-check.sh`。
- 删除一次性服务器报告 `production-server-report.md`。

### Notes

- 本次变更未修改业务逻辑、API 行为、数据库结构、Docker Compose 服务名、端口映射规则或 Nginx 路由规则。
