# 生产部署信息补充表

这份表用于第 2 步：基于你的真实服务器、域名和账号信息，生成最简单的一键生产部署配置与脚本。

## 1. 先在生产服务器生成自动采集报告

把项目放到服务器后，在项目根目录执行：

```bash
chmod +x scripts/ops/collect-prod-info.sh
PROJECT_DIR=/opt/frj-cms \
FRONTEND_DOMAIN=www.example.com \
ROOT_DOMAIN=example.com \
CMS_DOMAIN=cms.example.com \
./scripts/ops/collect-prod-info.sh
```

执行后会生成：

```text
production-server-report.md
```

请把 `production-server-report.md` 的内容和下面补完的表格一起发回来。

如果项目还没有放到服务器，也可以先只执行表格部分；我会在第 2 步里把服务器初始化、项目拉取、环境变量生成、Nginx、HTTPS、启动和验收脚本串成傻瓜式流程。

## 2. 你需要补充的信息

### 服务器与登录

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 云服务商 |  | 例如 Vultr / AWS / 阿里云国际 / 腾讯云国际 |
| 服务器地区 |  | 例如 Los Angeles |
| 操作系统 |  | 推荐 Ubuntu Server 24.04 LTS x86_64 |
| CPU / 内存 / 硬盘 |  | 例如 2C / 4GB / 80GB |
| 公网 IPv4 |  | 用于核对 DNS A 记录 |
| 是否有 IPv6 |  | 有 / 没有 / 不确定 |
| SSH 用户名 |  | 例如 root / ubuntu / deploy |
| SSH 端口 |  | 默认 22；如改过请填写 |
| 项目部署目录 |  | 推荐 `/opt/frj-cms` |
| 是否允许使用 `sudo` |  | 是 / 否 |

### 域名与 HTTPS

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 官网主域名 |  | 例如 `www.example.com` |
| 根域名是否也访问官网 |  | 是 / 否；例如 `example.com` 是否跳到 `www.example.com` |
| CMS/API 域名 |  | 例如 `cms.example.com` |
| 域名 DNS 是否已指向服务器 IP |  | 是 / 否 / 不确定 |
| Certbot 证书邮箱 |  | 用于申请 HTTPS 证书和续期通知 |
| 是否强制 HTTPS |  | 推荐：是 |

### 代码仓库

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| Git 仓库地址 |  | HTTPS 或 SSH 地址 |
| 生产分支 |  | 例如 `main` |
| 服务器是否已经配置仓库访问权限 |  | 是 / 否 / 不确定 |
| 是否需要脚本自动 `git pull` 更新 |  | 推荐：是 |

### 站点配置

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| `SITE_CODE` |  | 当前支持 `us` / `de` / `jp` |
| 前端公开地址 `APP_URL` |  | 例如 `https://www.example.com` |
| Strapi 公开地址 `STRAPI_PUBLIC_URL` |  | 例如 `https://cms.example.com` |
| 浏览器访问 API 地址 `NEXT_PUBLIC_API_URL` |  | 通常同 `STRAPI_PUBLIC_URL` |
| Strapi 内网地址 `STRAPI_URL` |  | 默认保留 `http://strapi-prod:1337` |

### 生产账号与密钥

如果你不想手动生成密码和密钥，可在“你填写”里写 `请脚本生成`。

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| Strapi 管理员邮箱 |  | 首次初始化后台使用 |
| Strapi 管理员初始密码 |  | 可填写 `请脚本生成` |
| PostgreSQL 数据库名 |  | 默认 `frjcms` |
| PostgreSQL 用户名 |  | 默认 `strapi` |
| PostgreSQL 密码 |  | 可填写 `请脚本生成` |
| Strapi `APP_KEYS` |  | 可填写 `请脚本生成` |
| Strapi `API_TOKEN_SALT` |  | 可填写 `请脚本生成` |
| Strapi `ADMIN_JWT_SECRET` |  | 可填写 `请脚本生成` |
| Strapi `TRANSFER_TOKEN_SALT` |  | 可填写 `请脚本生成` |
| Strapi `JWT_SECRET` |  | 可填写 `请脚本生成` |
| Strapi `ENCRYPTION_KEY` |  | 可填写 `请脚本生成` |

### Docker 与镜像源

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| Node 镜像 |  | 默认 `node:20-bookworm-slim` |
| PostgreSQL 镜像 |  | 默认 `postgres:16-alpine` |
| npm registry |  | 默认 `https://registry.npmjs.org`；国内网络可用 npmmirror |
| 是否需要 Docker 镜像加速 |  | 是 / 否 / 不确定 |

### 端口与防火墙

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 公网开放端口 |  | 推荐只开放 `22`、`80`、`443` |
| Next.js 本机端口 |  | 默认 `127.0.0.1:3000` |
| Strapi 本机端口 |  | 默认 `127.0.0.1:1337` |
| PostgreSQL 本机端口 |  | 默认 `127.0.0.1:5432` |
| 是否需要公网临时直连测试 3000/1337 |  | 推荐：否 |

### 数据与备份

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 是否是全新部署 |  | 是 / 否 |
| 是否已有旧数据库要迁移 |  | 是 / 否 |
| 是否已有 Strapi 上传文件要迁移 |  | 是 / 否 |
| 备份目录 |  | 默认项目内 `./backups` |
| 自动备份频率 |  | 例如每天一次 / 暂不需要 |
| 备份保留天数 |  | 例如 14 天 / 30 天 |

### 期望的一键脚本行为

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 是否允许脚本安装 Docker / Nginx / Certbot |  | 是 / 否 |
| 是否允许脚本配置 UFW 防火墙 |  | 是 / 否 |
| 是否允许脚本写入 Nginx 站点配置 |  | 是 / 否 |
| 是否允许脚本申请 HTTPS 证书 |  | 是 / 否 |
| 是否允许脚本覆盖 `.env.production` |  | 是 / 否；已有生产环境时请谨慎 |
| 部署时能接受的停机窗口 |  | 新站可填“不限制” |

## 3. 第 2 步我会基于这些信息修改/新增

| 文件 | 用途 |
| --- | --- |
| `.env.production.example` 或生成脚本 | 收敛生产环境变量，避免手工漏填 |
| `deploy/nginx/*.conf` | 生成真实域名的 Nginx 反向代理配置 |
| `scripts/ops/*.sh` | 增加一键初始化、部署、更新、验收、备份脚本 |
| `docs/*.md` | 写成按顺序复制执行的生产部署手册 |

目标是让生产上线流程变成：填表、运行脚本、等服务健康检查通过、访问域名。
