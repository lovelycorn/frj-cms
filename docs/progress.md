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

## 当前状态

- `frontend`：运行正常
- `backend`：运行正常
- `postgres`：运行正常
- 管理后台：`/admin` 可进入并可编辑内容模型
- 多国家站点：可通过 `SITE_CODE` 切换品牌与文案基础信息

## 风险与待办

- 生产环境密钥与默认账号需替换
- 需补充自动化测试（接口与页面）
- 需补充 CI/CD（构建、镜像、部署流水线）
- 需补充数据备份与恢复脚本

## 下一步建议

- 增加 i18n 路由层（按 locale 输出页面）
- 建立 `site-config` 到 CMS 字段的映射策略
- 建立公共 UI/Schema/API SDK 包
