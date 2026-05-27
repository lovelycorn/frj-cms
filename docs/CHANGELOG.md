# Changelog

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
