# FRJ CMS 部署手册

本文档对应当前真实工程（`docker-compose.dev.yml` + `docker-compose.prod.yml`），不涉及业务改造。

## 1. 系统要求

- CPU: 2 Core+
- RAM: 4GB+（建议开启 2GB swap）
- Disk: 40GB+
- OS: Ubuntu 22.04/24.04（生产推荐）
- Docker Engine + Docker Compose Plugin
- Git

## 2. Ubuntu 环境准备

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg git openssl ufw
```

可选 swap（低内存主机建议）：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 3. Docker 安装

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
newgrp docker
```

## 4. Docker Compose 安装

新版本 Docker 已内置 compose plugin，验证：

```bash
docker compose version
```

## 5. Git 安装

```bash
git --version
```

如未安装：

```bash
sudo apt-get install -y git
```

## 6. 项目初始化

```bash
git clone <your-repo-url> /opt/frj-cms
cd /opt/frj-cms
```

## 7. env 配置

开发环境：

```bash
cp .env.development.example .env.development
```

生产环境：

```bash
cp .env.production.example .env.production
```

必须修改生产密钥与密码：

- `POSTGRES_PASSWORD`
- `DATABASE_PASSWORD`
- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `STRAPI_ADMIN_EMAIL`
- `STRAPI_ADMIN_PASSWORD`

## 8. 开发环境部署

```bash
./scripts/dev.sh
```

或：

```bash
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```

## 9. 生产环境部署

统一入口：

```bash
./scripts/deploy-prod.sh
```

脚本自动执行：

- 预检：`docker`、`docker compose`、`git`、端口占用、env 文件
- `git pull --ff-only`
- `docker compose build`
- `docker compose up -d`
- 输出容器状态和访问地址

## 10. 一键部署方法

```bash
cd /opt/frj-cms
./scripts/deploy-prod.sh
```

## 11. 常用命令

查看状态：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

重建并后台启动：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

停止服务：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

## 12. 日志查看

生产日志：

```bash
./scripts/logs.sh
```

指定服务：

```bash
./scripts/logs.sh nextjs-prod
./scripts/logs.sh strapi-prod
./scripts/logs.sh postgres
```

开发日志：

```bash
MODE=dev ./scripts/logs.sh
```

## 13. 容器管理

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml restart nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml restart strapi-prod
```

## 14. 数据备份

```bash
./scripts/backup.sh
```

自定义目录：

```bash
./scripts/backup.sh /opt/frj-cms/backups
```

## 15. 数据恢复

```bash
./scripts/restore.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

## 16. 常见问题

1. `docker compose` 不可用

- 确认 Docker 已正确安装并重登 shell。

2. `permission denied /var/run/docker.sock`

- 当前用户未加入 docker 组：`sudo usermod -aG docker "$USER"` 后重新登录。

3. 部署后无法访问

- 检查 `.env.production` 中 `NEXT_PORT/STRAPI_PORT`。
- 检查安全组与防火墙放通对应端口。

## 17. 故障排查

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 strapi-prod
curl -s http://127.0.0.1:3000/api/health
curl -s http://127.0.0.1:1337/api/health
```

## 18. 升级流程

```bash
cd /opt/frj-cms
git pull --ff-only
./scripts/deploy-prod.sh
```

建议升级前执行：

```bash
./scripts/backup.sh
```
