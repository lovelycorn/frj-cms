# CentOS 7.9 部署手册（生产测试）

适用场景：将当前 `frj-cms` 项目部署到 CentOS 7.9 服务器进行第一轮生产验证。

## 1. 服务器基线

你当前配置（2C4G / 80GB / 30Mbps）可运行本项目。

建议准备：

- 已绑定公网 IP
- 已放行 `3000`、`1337`（测试期）
- `5432` 默认不对公网放行

## 2. 安装 Docker 与 Compose

```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

验证：

```bash
docker --version
docker compose version
```

如果 `docker compose` 不可用，使用插件二进制兜底：

```bash
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.7/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
docker compose version
```

## 3. 拉取项目并配置环境

```bash
git clone <你的仓库地址> frj-cms
cd frj-cms
cp .env.production.example .env
```

编辑 `.env`（至少修改以下项）：

- `APP_URL`
- `NEXT_PUBLIC_API_URL`
- `STRAPI_PUBLIC_URL`
- `POSTGRES_PASSWORD`
- `DATABASE_PASSWORD`
- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `STRAPI_ADMIN_PASSWORD`

## 4. 启动生产服务

```bash
docker compose --profile prod up --build -d
```

检查状态：

```bash
docker compose ps
```

## 5. 验证服务

```bash
curl -s http://127.0.0.1:3000/api/health
curl -s http://127.0.0.1:1337/api/health
./scripts/smoke-check.sh
```

浏览器验证：

- `http://<服务器IP>:3000`
- `http://<服务器IP>:1337/admin`

## 6. 防火墙（firewalld）

仅测试期：

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --permanent --add-port=1337/tcp
sudo firewall-cmd --reload
```

生产建议：

- 仅开放 `80/443`
- `1337` 放到内网或白名单
- 通过 Nginx/Caddy 反向代理 Strapi Admin

## 7. 日志与故障排查

```bash
docker compose logs --tail=200 nextjs-prod
docker compose logs --tail=200 strapi-prod
docker compose logs --tail=200 postgres
```

重点检查：

- `getaddrinfo ENOTFOUND postgres`：数据库主机配置错误
- `401/403`：Public 权限未放开 `find/findOne`
- 页面无数据：`NEXT_PUBLIC_API_URL` 不可达或跨域配置问题

## 8. 备份与恢复

备份：

```bash
./scripts/ops/backup-postgres.sh
```

恢复：

```bash
./scripts/ops/restore-postgres.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

## 9. 升级与回滚

升级：

```bash
git pull
./scripts/ops/backup-postgres.sh
docker compose --profile prod up --build -d
./scripts/smoke-check.sh
```

回滚（示例）：

```bash
git log --oneline
git checkout <稳定提交ID>
docker compose --profile prod up --build -d
```

如果数据结构变更，按需恢复数据库备份。
