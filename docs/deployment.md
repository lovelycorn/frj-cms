# 部署文档

## 1. 环境准备

最低要求：

- Docker Engine 24+
- Docker Compose v2
- CPU 2 Core / RAM 4GB（当前生产测试机配置可用）

建议开放端口：

- `3000`（Next.js）
- `1337`（Strapi 管理后台，仅测试阶段开放）
- `5432`（PostgreSQL，生产建议仅内网或不开放）

## 2. 环境变量

开发环境：

```bash
cp .env.example .env
```

生产环境：

```bash
cp .env.production.example .env
```

生产必改项：

- `APP_URL`
- `NEXT_PUBLIC_API_URL`
- `STRAPI_PUBLIC_URL`
- `POSTGRES_PASSWORD`
- `DATABASE_PASSWORD`
- `APP_KEYS / JWT / SALT / ENCRYPTION_KEY`
- `STRAPI_ADMIN_PASSWORD`

## 3. 开发部署

```bash
docker compose --profile dev up --build
```

验证：

- `http://localhost:3000`
- `http://localhost:1337/admin`
- `./scripts/smoke-check.sh`

## 4. 生产部署

```bash
docker compose --profile prod up --build -d
```

健康检查：

```bash
curl -s http://localhost:3000/api/health
curl -s http://localhost:1337/api/health
./scripts/smoke-check.sh
```

## 5. 运维命令

查看状态：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f nextjs-prod
docker compose logs -f strapi-prod
docker compose logs -f postgres
```

平滑重启：

```bash
docker compose --profile prod up -d
```

停止服务：

```bash
docker compose --profile prod down
```

## 6. 数据备份与恢复

备份：

```bash
./scripts/ops/backup-postgres.sh
```

恢复：

```bash
./scripts/ops/restore-postgres.sh ./backups/frjcms-YYYYMMDD-HHMMSS.sql
```

## 7. 安全建议

- 生产环境替换所有默认密钥
- Strapi 管理后台建议走白名单或 VPN
- PostgreSQL 不直接暴露公网
- 反向代理启用 HTTPS（Nginx/Caddy）

## 8. 故障排查

### 8.1 镜像拉取超时

症状：`auth.docker.io ... i/o timeout`

解决：

```env
NODE_IMAGE=m.daocloud.io/docker.io/library/node:20-alpine
NPM_REGISTRY=https://registry.npmmirror.com
```

重建：

```bash
docker compose --profile prod down --remove-orphans
docker compose --profile prod up --build --force-recreate -d
```

### 8.2 Strapi 启动失败并重启

检查：

```bash
docker compose logs --tail=200 strapi-prod
```

常见原因：

- `DATABASE_HOST` 非 `postgres`
- 数据库账号密码不一致
- `APP_KEYS` 等密钥缺失

### 8.3 页面能打开但无数据

检查：

- `NEXT_PUBLIC_API_URL` 是否可被浏览器访问
- `STRAPI_URL` 是否指向容器内地址（建议 `http://strapi-prod:1337`）
- `Strapi > Settings > Users & Permissions > Public` 是否开放 `find/findOne`
