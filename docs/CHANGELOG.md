# Changelog

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
