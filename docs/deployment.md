# 环境与部署入口

本项目已将开发环境和生产环境拆成独立部署文件，避免通过同一个 Compose profile 切换环境。

## 1. 文件边界

| 环境 | 机器 | Compose 文件 | 环境变量文件 | 文档 |
| --- | --- | --- | --- | --- |
| 开发 | macOS M2 Pro / 16GB / 1TB | `docker-compose.dev.yml` | `.env.development` | [development.md](development.md) |
| 生产 | Ubuntu Server 24.04 | `docker-compose.prod.yml` | `.env.production` | [deployment-ubuntu-24.04.md](deployment-ubuntu-24.04.md) |

模板文件：

- `.env.development.example`
- `.env.production.example`

## 2. 开发环境快速启动

```bash
cp .env.development.example .env.development
docker compose --env-file .env.development -f docker-compose.dev.yml up --build
```

访问：

- `http://localhost:3000`
- `http://localhost:1337/admin`

验证：

```bash
./scripts/smoke-check.sh
```

## 3. 生产环境快速部署

推荐生产系统：

**Ubuntu Server 24.04 LTS x86_64**

推荐理由：

- Ubuntu 24.04 LTS 生命周期长，标准安全维护到 2029 年，后续可通过 Ubuntu Pro 延长维护。
- Docker Engine 官方文档直接支持 Ubuntu 24.04，安装和排障路径清晰。
- 海外节点使用 Ubuntu + Docker + Nginx + Certbot 的兼容性和资料更好。
- CentOS 7 已停止维护，不适合作为新生产环境。

生产启动：

```bash
cp .env.production.example .env.production
# 修改 .env.production 中所有域名、密码、密钥
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
```

如果出现 Docker 权限错误：

```text
permission denied while trying to connect to the docker API at unix:///var/run/docker.sock
```

先在服务器执行：

```bash
sudo usermod -aG docker "$USER"
newgrp docker
docker ps
```

如仍未生效，退出 SSH 后重新登录，再执行生产启动命令。

本机验证：

```bash
curl -s http://127.0.0.1:3000/api/health
curl -s http://127.0.0.1:1337/api/health
FRONTEND_URL=http://127.0.0.1:3000 STRAPI_URL=http://127.0.0.1:1337 ./scripts/smoke-check.sh
```

生产环境默认只把 `3000`、`1337`、`5432` 绑定到 `127.0.0.1`，公网通过 Nginx 暴露 `80/443`。

## 4. 生产必改环境变量

```env
APP_URL=https://www.example.com
NEXT_PUBLIC_API_URL=https://cms.example.com
STRAPI_PUBLIC_URL=https://cms.example.com
STRAPI_URL=http://strapi-prod:1337

POSTGRES_PASSWORD=<强密码>
DATABASE_PASSWORD=<同 POSTGRES_PASSWORD>
DATABASE_URL=postgresql://strapi:<强密码>@postgres:5432/frjcms

APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<随机字符串>
ADMIN_JWT_SECRET=<随机字符串>
TRANSFER_TOKEN_SALT=<随机字符串>
JWT_SECRET=<随机字符串>
ENCRYPTION_KEY=<随机字符串>

STRAPI_ADMIN_EMAIL=<管理员邮箱>
STRAPI_ADMIN_PASSWORD=<强密码>
```

## 5. 运维命令

生产查看状态：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

生产查看日志：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f strapi-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f postgres
```

生产重启：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

生产停止：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

## 6. 数据备份与恢复

备份脚本默认使用生产配置：

```bash
./scripts/ops/backup-postgres.sh
```

恢复：

```bash
./scripts/ops/restore-postgres.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

如需在开发环境备份，可显式切换：

```bash
COMPOSE_FILE=docker-compose.dev.yml COMPOSE_ENV_FILE=.env.development ./scripts/ops/backup-postgres.sh
```

## 7. Nginx 模板

生产 Nginx 配置模板：

```text
deploy/nginx/frj-cms.conf.example
```

完整生产部署步骤见 [deployment-ubuntu-24.04.md](deployment-ubuntu-24.04.md)。
