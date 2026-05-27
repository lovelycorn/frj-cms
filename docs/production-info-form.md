# 生产部署信息补充表

这份表用于第 2 步：基于你的真实服务器、IP、端口和账号信息，生成最简单的一键生产部署配置与脚本。

当前生产计划先不配置域名和 HTTPS，采用 IP+端口访问：

| 服务 | 外网访问地址 |
| --- | --- |
| 官网前端 | `http://165.154.163.41:18080` |
| Strapi Admin/API | `http://165.154.163.41:10086` |

## 1. 先在生产服务器生成自动采集报告

把项目放到服务器后，在项目根目录执行：

```bash
chmod +x scripts/ops/collect-prod-info.sh
PROJECT_DIR=/opt/frj-cms \
PUBLIC_IP=165.154.163.41 \
FRONTEND_PUBLIC_PORT=18080 \
CMS_PUBLIC_PORT=10086 \
./scripts/ops/collect-prod-info.sh
```

执行后会生成：

```text
production-server-report.md
```

请把 `production-server-report.md` 的内容和下面补完的表格一起发回来。

如果项目还没有放到服务器，也可以先只执行表格部分；我会在第 2 步里把服务器初始化、项目拉取、环境变量生成、Docker 启动和验收脚本串成傻瓜式流程。域名、Nginx、HTTPS 先不做，后续有域名后再补。

## 2. 你需要补充的信息

### 服务器与登录

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 云服务商 | `ucloud` | ucloud |
| 服务器地区 | `Los Angeles` | Los Angeles |
| 操作系统 | `Ubuntu Server 24.04` | Ubuntu Server 24.04 |
| CPU / 内存 / 硬盘 | `2C / 4GB / 80GB` | 2C / 4GB / 80GB |
| 公网 IPv4 | `165.154.163.41` | 外网访问入口 |
| 是否有 IPv6 | `不确定` | 不确定 |
| SSH 用户名 | `ubuntu` | ubuntu |
| SSH 端口 | `22` | 默认 22；如改过请填写 |
| 项目部署目录 | `/opt/frj-cms` | 推荐 `/opt/frj-cms` |
| 是否允许使用 `sudo` | `是` | 是 / 否 |

### 访问方式

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 当前访问模式 | `IP+端口` | 暂不配置域名 |
| 官网外网地址 | `http://165.154.163.41:18080` | 前端访问地址 |
| Strapi Admin/API 外网地址 | `http://165.154.163.41:10086` | 后台和 API 地址 |
| 官网域名 | 暂无 | 后续有域名再配置 |
| CMS/API 域名 | 暂无 | 后续有域名再配置 |
| 是否配置 HTTPS | 否 | IP+端口模式先走 HTTP |
| 后续是否计划接入域名 | `是` | 是 / 否 / 不确定 |

### 代码仓库

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| Git 仓库地址 | `https://github.com/lovelycorn/frj-cms.git` | HTTPS 或 SSH 地址 |
| 生产分支 | `main` | `main` |
| 服务器是否已经配置仓库访问权限 | `是` | 是 / 否 / 不确定 |
| 是否需要脚本自动 `git pull` 更新 | `是` | 推荐：是 |

### 站点配置

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| `SITE_CODE` | `us` | 当前支持 `us` / `de` / `jp` |
| 前端公开地址 `APP_URL` | `http://165.154.163.41:18080` | 前端外网地址 |
| Strapi 公开地址 `STRAPI_PUBLIC_URL` | `http://165.154.163.41:10086` | Strapi 外网地址 |
| 浏览器访问 API 地址 `NEXT_PUBLIC_API_URL` | `http://165.154.163.41:10086` | 通常同 `STRAPI_PUBLIC_URL` |
| Strapi 内网地址 `STRAPI_URL` | `http://strapi-prod:1337` | 默认保留 `http://strapi-prod:1337` |

### 生产账号与密钥

如果你不想手动生成密码和密钥，可在“你填写”里写 `请脚本生成`。

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| Strapi 管理员邮箱 | `admin@frj-cms.local` | 首次初始化后台使用 |
| Strapi 管理员初始密码 | `请脚本生成` | 可填写 `请脚本生成` |
| PostgreSQL 数据库名 | `frjcms` | 默认 `frjcms` |
| PostgreSQL 用户名 | `strapi` | 默认 `strapi` |
| PostgreSQL 密码 | `请脚本生成` | 可填写 `请脚本生成` |
| Strapi `APP_KEYS` | `请脚本生成` | 可填写 `请脚本生成` |
| Strapi `API_TOKEN_SALT` | `请脚本生成` | 可填写 `请脚本生成` |
| Strapi `ADMIN_JWT_SECRET` | `请脚本生成` | 可填写 `请脚本生成` |
| Strapi `TRANSFER_TOKEN_SALT` | `请脚本生成` | 可填写 `请脚本生成` |
| Strapi `JWT_SECRET` | `请脚本生成` | 可填写 `请脚本生成` |
| Strapi `ENCRYPTION_KEY` | `请脚本生成` | 可填写 `请脚本生成` |

### Docker 与镜像源

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| Node 镜像 | `node:20-bookworm-slim` | 默认 `node:20-bookworm-slim` |
| PostgreSQL 镜像 | `postgres:16-alpine` | 默认 `postgres:16-alpine` |
| npm registry | `https://registry.npmjs.org` | 默认 `https://registry.npmjs.org`；国内网络可用 npmmirror |
| 是否需要 Docker 镜像加速 | `否` | 是 / 否 / 不确定 |

### 端口与防火墙

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 公网开放端口 | `18080`、`10086` | 另需 SSH 端口用于登录 |
| Next.js 外网端口 | `18080` | 生产会映射到容器内 `3000` |
| Strapi 外网端口 | `10086` | 生产会映射到容器内 `1337` |
| PostgreSQL 本机端口 | `127.0.0.1:5432` | 数据库不要开放公网 |
| Next.js 绑定地址 | `0.0.0.0` | 允许外网访问 `18080` |
| Strapi 绑定地址 | `0.0.0.0` | 允许外网访问 `10086` |
| PostgreSQL 绑定地址 | `127.0.0.1` | 只允许本机访问 |
| 是否需要额外开放 3000/1337 | 否 | 当前只使用 `18080`、`10086` |

### 数据与备份

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 是否是全新部署 | `是` | 是 / 否 |
| 是否已有旧数据库要迁移 | `否` | 是 / 否 |
| 是否已有 Strapi 上传文件要迁移 | `否` | 是 / 否 |
| 备份目录 | `./backups` | 默认项目内 `./backups` |
| 自动备份频率 | `暂不需要` | 例如每天一次 / 暂不需要 |
| 备份保留天数 | `30 天` | 例如 14 天 / 30 天 |

### 期望的一键脚本行为

| 项目 | 你填写 | 说明 |
| --- | --- | --- |
| 是否允许脚本安装 Docker | `是` | 是 / 否 |
| 是否安装 Nginx / Certbot | `是` | 当前仅安装，不启用 HTTPS 配置 |
| 是否允许脚本配置 UFW 防火墙 | `是` | 是 / 否 |
| 是否允许脚本写入 Nginx 站点配置 | `是` | 先生成模板，后续接域名时启用 |
| 是否允许脚本申请 HTTPS 证书 | 暂不需要 | 没有域名时先不申请 |
| 是否允许脚本覆盖 `.env.production` | `是` | 是 / 否；已有生产环境时请谨慎 |
| 部署时能接受的停机窗口 | `不限制` | 新站可填“不限制” |

## 3. 第 2 步我会基于这些信息修改/新增

| 文件 | 用途 |
| --- | --- |
| `.env.production.example` 或生成脚本 | 收敛 IP+端口模式的生产环境变量，避免手工漏填 |
| `docker-compose.prod.yml` | 调整生产端口绑定到 `0.0.0.0:18080` 和 `0.0.0.0:10086` |
| `scripts/ops/*.sh` | 增加一键初始化、部署、更新、验收、备份脚本 |
| `docs/deployment-ip-ports.md` | 当前 IP+端口模式的一键部署手册 |

目标是让生产上线流程变成：填表、运行脚本、等服务健康检查通过、访问 `http://165.154.163.41:18080` 和 `http://165.154.163.41:10086/admin`。
