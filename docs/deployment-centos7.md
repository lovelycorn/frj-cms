# CentOS 7.9 部署手册（历史归档）

CentOS 7 已停止维护，不再推荐用于新的生产环境。

当前项目的生产环境标准已切换为：

- 系统：Ubuntu Server 24.04 LTS
- Compose：`docker-compose.prod.yml`
- 环境变量：`.env.production`
- 生产手册：[deployment-ubuntu-24.04.md](deployment-ubuntu-24.04.md)

如必须维护旧 CentOS 7 测试机，请先迁移到 Ubuntu 24.04 LTS 再按当前生产手册部署。旧的 profile 部署入口已不再作为主线维护。
