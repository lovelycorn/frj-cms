# Ubuntu 24.04 LTS 生产部署手册

适用场景：单台海外洛杉矶云主机，配置约 2C / 4GB RAM / 80GB SSD / 30Mbps 峰值带宽，通过 `docker-compose.prod.yml` 部署本项目稳定版本。

## 1. 系统版本推荐

推荐使用 **Ubuntu Server 24.04 LTS x86_64**。

选择理由：

- Ubuntu 24.04 LTS 仍处于长期支持期，标准安全维护到 2029 年，后续可通过 Ubuntu Pro 延长维护。
- Docker Engine 官方安装文档直接支持 Ubuntu 24.04（noble），安装路径清晰。
- 相比 CentOS 7，Ubuntu 24.04 没有生命周期风险；CentOS 7 已停止维护，不建议新生产环境继续使用。
- 相比 CentOS Stream / openEuler，Ubuntu 在海外云主机、Docker、Nginx、Certbot、运维资料上的兼容性和排障成本更低。
- Ubuntu 26.04 LTS 虽然更新，但截至 2026-05-27，24.04 LTS 对单机生产部署更稳妥。

官方依据：

- Ubuntu 生命周期：https://ubuntu.com/about/release-cycle
- Docker Ubuntu 安装文档：https://docs.docker.com/engine/install/ubuntu/
- CentOS 生命周期：https://www.centos.org/cl-vs-cs/

## 2. 部署目标

生产入口：

- 官网：`https://www.example.com`
- Strapi 管理后台/API：`https://cms.example.com`

本机端口策略：

- Docker 容器只绑定 `127.0.0.1:3000`、`127.0.0.1:1337`、`127.0.0.1:5432`
- 公网只开放 `80/443`
- Nginx 负责 HTTPS 和反向代理
- PostgreSQL 不直接暴露公网

生产部署文件：

- Compose：`docker-compose.prod.yml`
- 环境变量模板：`.env.production.example`
- 生产环境变量：`.env.production`

上线前准备：

- 一台 Ubuntu Server 24.04 LTS 主机
- 域名 A 记录指向服务器公网 IP：`www.example.com`、`cms.example.com`
- 项目 Git 仓库地址

## 3. 初始化服务器

登录服务器后执行：

```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg git ufw openssl
```

建议为 4GB 内存主机增加 2GB swap，避免首次 Docker 构建时内存紧张：

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

设置防火墙：

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

不要开放 `3000`、`1337`、`5432`。本项目生产模板默认把这些端口绑定到 `127.0.0.1`。

## 4. 安装 Docker Engine

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

. /etc/os-release
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

允许当前登录用户直接执行 Docker 命令：

```bash
sudo usermod -aG docker "$USER"
newgrp docker
```

说明：`docker` 组具备接近 root 的权限。单人维护的生产服务器这样配置最方便；如果你不希望授权当前用户，则后续所有 `docker compose ...` 命令都需要加 `sudo`。

验证：

```bash
docker --version
docker compose version
docker ps
sudo systemctl status docker --no-pager
```

如果 `docker ps` 报 `permission denied while trying to connect to the docker API at unix:///var/run/docker.sock`，执行：

```bash
sudo usermod -aG docker "$USER"
newgrp docker
docker ps
```

如果 `newgrp docker` 后仍未生效，退出 SSH 后重新登录服务器，再执行 `docker ps`。

## 5. 拉取项目并配置环境

建议部署到 `/opt/frj-cms`：

```bash
sudo mkdir -p /opt/frj-cms
sudo chown "$USER":"$USER" /opt/frj-cms
git clone <你的仓库地址> /opt/frj-cms
cd /opt/frj-cms
cp .env.production.example .env.production
```

编辑 `.env.production`：

```bash
nano .env.production
```

至少修改：

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

生成随机密钥示例：

```bash
openssl rand -base64 32
```

生产环境默认值保持不变：

```env
NEXT_BIND_ADDR=127.0.0.1
STRAPI_BIND_ADDR=127.0.0.1
POSTGRES_BIND_ADDR=127.0.0.1
NPM_REGISTRY=https://registry.npmjs.org
```

如果只是临时用公网 IP 直连测试，可以把 `NEXT_BIND_ADDR` 和 `STRAPI_BIND_ADDR` 改为 `0.0.0.0`，测试完成后改回 `127.0.0.1` 并接入 Nginx。

## 6. 启动生产服务

```bash
cd /opt/frj-cms
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

命令需要整行执行。如果手动换行，请使用反斜杠：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml \
  up --build -d
```

本机健康检查：

```bash
curl -s http://127.0.0.1:3000/api/health
curl -s http://127.0.0.1:1337/api/health
FRONTEND_URL=http://127.0.0.1:3000 STRAPI_URL=http://127.0.0.1:1337 ./scripts/smoke-check.sh
```

## 7. 配置 Nginx 和 HTTPS

安装 Nginx 与 Certbot：

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo systemctl enable --now nginx
```

安装站点配置：

```bash
sudo cp /opt/frj-cms/deploy/nginx/frj-cms.conf.example /etc/nginx/sites-available/frj-cms
sudo nano /etc/nginx/sites-available/frj-cms
```

把配置中的域名替换为真实域名：

- `www.example.com`、`example.com`
- `cms.example.com`

启用配置：

```bash
sudo ln -sf /etc/nginx/sites-available/frj-cms /etc/nginx/sites-enabled/frj-cms
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

申请 HTTPS 证书：

```bash
sudo certbot --nginx -d www.example.com -d example.com -d cms.example.com
```

公网验证：

```bash
curl -I https://www.example.com
curl -I https://cms.example.com/api/health
```

浏览器访问：

- `https://www.example.com`
- `https://cms.example.com/admin`

## 8. 日常运维命令

查看状态：

```bash
cd /opt/frj-cms
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

查看日志：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 strapi-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 postgres
```

重启生产服务：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

停止服务：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

更新部署：

```bash
cd /opt/frj-cms
./scripts/ops/backup-postgres.sh
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
FRONTEND_URL=https://www.example.com STRAPI_URL=https://cms.example.com ./scripts/smoke-check.sh
```

## 9. 备份与恢复

手动备份：

```bash
cd /opt/frj-cms
./scripts/ops/backup-postgres.sh
```

恢复：

```bash
cd /opt/frj-cms
./scripts/ops/restore-postgres.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

建议配置每日备份：

```bash
crontab -e
```

加入：

```cron
0 3 * * * cd /opt/frj-cms && /usr/bin/env bash ./scripts/ops/backup-postgres.sh ./backups >> ./backups/backup.log 2>&1
```

数据库备份只在本机并不够，生产环境还应定期同步到对象存储或另一台服务器。

## 10. 故障排查

镜像或依赖下载慢：

```env
NODE_IMAGE=m.daocloud.io/docker.io/library/node:20-bookworm-slim
POSTGRES_IMAGE=m.daocloud.io/docker.io/library/postgres:16-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

改完后重建：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up --build --force-recreate -d
```

Next.js 构建报 `/app/public: not found`：

```text
COPY --from=builder /app/public ./public
failed to calculate checksum ... "/app/public": not found
```

原因是旧版前端生产 Dockerfile 依赖 `frontend/public` 目录存在，而空目录不会被 Git 跟踪。更新代码后重新构建：

```bash
git pull
docker compose --env-file .env.production -f docker-compose.prod.yml build --no-cache nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

Strapi 构建报 `Failed to load native binding`：

```text
Error: Failed to load native binding
at Object.<anonymous> (/app/node_modules/@swc/core/binding.js...)
```

这是 Strapi admin 构建依赖 SWC 原生模块，旧版生产镜像使用 Alpine 时可能缺少匹配的 native binding。确认 `.env.production` 使用 Debian slim Node 镜像后无缓存重建：

```env
NODE_IMAGE=node:20-bookworm-slim
```

同时确认后端依赖已显式包含 Linux x64 SWC native package：

```bash
grep -n "@swc/core-linux-x64-gnu" backend/package.json backend/package-lock.json
```

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml build --no-cache strapi-prod
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

Strapi 无法连接数据库：

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=200 strapi-prod
```

重点检查：

- `DATABASE_HOST=postgres`
- `DATABASE_PASSWORD` 与 `POSTGRES_PASSWORD` 一致
- `DATABASE_URL` 中的密码同步更新

页面能打开但没有数据：

- `NEXT_PUBLIC_API_URL` 必须是浏览器可访问的 `https://cms.example.com`
- `STRAPI_URL` 必须是容器内地址 `http://strapi-prod:1337`
- Strapi 后台 Public 权限需要开放对应内容类型的 `find/findOne`

HTTPS 证书申请失败：

- DNS A 记录是否已经指向服务器公网 IP
- 云厂商安全组是否放行 `80/443`
- `sudo nginx -t` 是否通过
