# Ubuntu 24.04 IP+端口一键部署手册

适用当前生产环境：`165.154.163.41`，前端端口 `18080`，Strapi/API 端口 `10086`。

## 1. 前置条件

- 服务器：Ubuntu 24.04 x86_64
- 登录用户：`ubuntu`（可用 `sudo`）
- 项目目录：`/opt/frj-cms`
- 仓库分支：`main`

## 2. 一条命令执行初始化 + 部署

在服务器执行：

```bash
cd /opt/frj-cms
chmod +x scripts/ops/setup-server-ip.sh scripts/ops/deploy-prod-ip.sh scripts/ops/one-click-prod-ip.sh
PROJECT_DIR=/opt/frj-cms PUBLIC_IP=165.154.163.41 FRONTEND_PORT=18080 CMS_PORT=10086 ./scripts/ops/one-click-prod-ip.sh
```

脚本会自动完成：

- 安装基础依赖（curl/git/openssl/ufw）
- 检查并安装 Docker
- 按需创建 2GB swap（当服务器无 swap 时）
- 配置 UFW 开放 `22`、`18080`、`10086`
- 按需安装 Nginx/Certbot（仅安装，不启用 HTTPS 配置）
- 自动生成 `.env.production`（含随机密钥和密码）
- `docker compose up --build -d` 启动服务
- 通过公网地址执行 smoke 检查

## 3. 访问地址

- 前端：`http://165.154.163.41:18080`
- Strapi 后台：`http://165.154.163.41:10086/admin`
- Strapi 健康接口：`http://165.154.163.41:10086/api/health`

## 4. 关键输出文件

- 生产环境变量：`.env.production`（权限 `600`）
- 自动生成凭据快照：`production-generated-credentials.<timestamp>.txt`（权限 `600`）

## 5. 常用运维命令

```bash
cd /opt/frj-cms
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f nextjs-prod
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f strapi-prod
./scripts/ops/backup-postgres.sh
```

## 6. 后续升级到域名和 HTTPS

当前脚本模式是“先跑起来”的 HTTP 直连模式。后续接入域名后，再切换到 `Nginx + 443` 并更新：

- `APP_URL`
- `NEXT_PUBLIC_API_URL`
- `STRAPI_PUBLIC_URL`
