# 项目计划

## 总体目标

构建可复制的外贸独立站模板，支持后续演进到：

- 多站点集群（site-us / site-de / site-jp）
- 中央 CMS
- CRM
- Dashboard
- AI 内容系统

## 阶段规划

### Phase 1（当前）

- 单站独立架构
- 前后端打通
- 模板页面与 SEO 基础能力
- Docker 化开发/生产运行

### Phase 2

- 多语言与多国家配置抽象
- 主题与站点配置外置
- CMS Schema 模板化
- 组件库公共包抽离

当前进展：

- 已完成 `SITE_CODE` 多国家配置中心
- 已完成 `/en`、`/de`、`/ja` i18n 路由层与默认 locale 跳转

### Phase 3

- 中央 CMS 聚合
- CRM 与线索流转
- Dashboard 监控
- AI 内容生成与发布流水线

## 本阶段交付验收标准

- 前端可访问并展示 CMS 数据
- Strapi 后台与 API 稳定可用
- PostgreSQL 连接正常
- 项目可复制到新站点目录并快速启动
