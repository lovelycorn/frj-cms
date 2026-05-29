# FRJ CMS 部署手册（V0.2）

本文档对应当前基线版本：`v0.2`。

## 1. 目标与拓扑

生产编排文件：`docker-compose.prod.yml`

服务：

- `postgres`
- `redis`
- `strapi-prod`
- `nextjs-prod`

默认端口来自 `.env.production`：

- Next.js: `NEXT_PORT`（默认 `18080`）
- Strapi: `STRAPI_PORT`（默认 `10086`）
- PostgreSQL: `POSTGRES_PORT`（默认 `5432`，建议仅本机绑定）

## 2. 服务器要求

- OS: Ubuntu 22.04/24.04
- Docker Engine + Docker Compose Plugin
- Git
- CPU: 2 Core+
- RAM: 4GB+（建议 2GB swap）
- Disk: 40GB+

## 3. 首次部署

### 3.1 克隆代码

```bash
git clone <your-repo-url> /opt/frj-cms
cd /opt/frj-cms
```

### 3.2 配置生产环境变量

```bash
cp .env.production.example .env.production
```

必须替换所有密钥与密码（禁止 `changeMe*`）：

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

### 3.3 一键部署

```bash
./scripts/deploy-prod.sh
```

脚本默认流程：

1. 预检（docker/git/env/端口）
2. `git pull --ff-only`
3. `docker compose build`
4. `docker compose up -d`
5. 容器健康等待
6. `api/health` smoke check
7. 输出容器状态与访问地址

## 4. deploy-prod.sh 可选参数

```bash
# 跳过拉代码
SKIP_GIT_PULL=1 ./scripts/deploy-prod.sh

# 跳过 build（仅重启/配置变更场景）
SKIP_BUILD=1 ./scripts/deploy-prod.sh

# 跳过健康接口 smoke check
SMOKE_CHECK=0 ./scripts/deploy-prod.sh

# 调整健康等待超时（秒）
HEALTH_TIMEOUT=300 ./scripts/deploy-prod.sh
```

## 5. 常用运维命令

### 查看状态

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

### 查看日志

```bash
./scripts/logs.sh
./scripts/logs.sh nextjs-prod
./scripts/logs.sh strapi-prod
```

### 重启服务

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml restart nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml restart strapi-prod
docker compose --env-file .env.production -f docker-compose.prod.yml restart redis
docker compose --env-file .env.production -f docker-compose.prod.yml restart postgres
```

### 停止/启动

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## 6. 健康检查

```bash
# Next.js
curl -fsS "http://127.0.0.1:${NEXT_PORT:-18080}/api/health"

# Strapi
curl -fsS "http://127.0.0.1:${STRAPI_PORT:-10086}/api/health"
```

## 7. 备份与恢复

### 备份

```bash
./scripts/backup.sh
# 或指定目录
./scripts/backup.sh /opt/frj-cms/backups
```

### 恢复

```bash
./scripts/restore.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

## 8. 升级流程

```bash
cd /opt/frj-cms
./scripts/backup.sh
./scripts/deploy-prod.sh
```

## 9. 常见故障

### 9.1 `docker compose` 不可用

- 检查 Docker 安装：`docker compose version`

### 9.2 `permission denied /var/run/docker.sock`

- 当前用户未加入 docker 组：

```bash
sudo usermod -aG docker "$USER"
# 重新登录后再试
```

### 9.3 端口冲突

- 检查 `.env.production` 中 `NEXT_PORT / STRAPI_PORT / POSTGRES_PORT`
- 调整后重新运行 `./scripts/deploy-prod.sh`

### 9.4 容器启动但页面不可访问

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 strapi-prod
```
