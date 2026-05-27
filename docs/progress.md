# 进度说明

更新日期：2026-05-27

## 已完成

- 完成基础目录与工程骨架
- 完成 Next.js 15 + TS + Tailwind 初始化
- 完成核心页面与组件模块化
- 完成 Strapi v5 内容模型与种子数据
- 完成 API 通信封装与页面数据展示
- 完成 Docker Compose（dev/prod）
- 完成网络超时兼容（Node 镜像、NPM 源可配置）
- 完成 Strapi 路由/controller/service 兼容修复
- 完成 DB DNS 解析问题修复（compose 网络方案）
- 完成站点配置抽离（`site-config`），支持 `SITE_CODE=us/de/jp`
- 完成 i18n 路由层：支持 `/en`、`/de`、`/ja` 访问与默认 locale 自动跳转
- 完成 `site-config` 与 Strapi `Global Settings` 联动（公司名/联系方式 CMS 可覆盖）
- 完成多语言 sitemap 输出（包含 locale 前缀 URL）
- 完成生产稳定性增强：
- 新增前后端健康检查接口（`/api/health`）
- Docker 服务健康检查、依赖顺序、日志滚动配置
- `strapi-prod` 上传目录持久化
- Dockerfile 生产构建改为 `npm ci`
- 新增 `.dockerignore`（frontend/backend）
- 新增运维脚本（smoke 检查、数据库备份/恢复）
- 新增 CentOS 7.9 部署手册

## 当前状态

- `frontend`：运行正常
- `backend`：运行正常
- `postgres`：运行正常
- 管理后台：`/admin` 可进入并可编辑内容模型
- 多国家站点：可通过 `SITE_CODE` 切换品牌与文案基础信息
- 多语言路由：前端内部跳转会自动保留当前 locale 前缀
- CMS 内容覆盖：`companyName`、`contactInfo` 已可在后台修改并前端生效
- 已具备生产测试部署条件（CentOS 7.9）

## 风险与待办

- 生产环境密钥与默认账号需全部替换
- 反向代理与 HTTPS 证书尚未接入
- 需补充自动化测试（接口与页面）
- 需补充 CI/CD（构建、镜像、部署流水线）

## 下一步建议

- 接入 Nginx/Caddy + HTTPS + 域名
- 增加 GitHub Actions（lint/typecheck/build/smoke）
- 将 `Global Settings` 扩展为按国家/语言维度配置
- 建立公共 UI/Schema/API SDK 包
