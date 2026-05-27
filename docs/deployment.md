# 部署文档

## 1. 环境准备

- Docker Desktop 最新稳定版
- Docker Compose v2

## 2. 环境变量

基于 `.env.example` 复制：

```bash
cp .env.example .env
```

关键变量：

- `NEXT_PUBLIC_API_URL`
- `STRAPI_URL`
- `DATABASE_*`
- `APP_KEYS / JWT / SALT`

## 3. 开发部署

```bash
docker compose --profile dev up --build
```

验证：

- `http://localhost:3000`
- `http://localhost:1337/admin`

## 4. 生产部署

```bash
docker compose --profile prod up --build -d
```

建议：

- 使用反向代理（Nginx/Caddy）
- 使用 HTTPS 证书
- 管理员密码、密钥全部替换
- PostgreSQL 开启定期备份

## 5. 故障排查

### 5.1 Node 镜像拉取超时

现象：`auth.docker.io ... i/o timeout`

处理：

```env
NODE_IMAGE=m.daocloud.io/docker.io/library/node:20-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

### 5.2 Strapi 无法连接数据库

现象：`getaddrinfo ENOTFOUND postgres`

处理步骤：

```bash
docker compose --profile dev down --remove-orphans
docker network rm frj_network 2>/dev/null || true
docker compose --profile dev up --build --force-recreate
```

