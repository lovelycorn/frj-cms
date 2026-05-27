# FRJ CMS Production Server Report

## Quick Warnings

- Swap is not enabled; add 2GB swap before first production build on small servers.
- IP+port mode exposes HTTP directly. This is simple for first launch, but HTTPS/domain mode should replace it before collecting sensitive traffic.

## Server Basics

| Item | Value |
| --- | --- |
| Hostname | 10-11-190-178 |
| Current user | ubuntu |
| Kernel | Linux 10-11-190-178 6.8.0-31-generic #31-Ubuntu SMP PREEMPT_DYNAMIC Sat Apr 20 00:40:06 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux |
| Architecture | x86_64 |
| OS release | PRETTY_NAME="Ubuntu 24.04.4 LTS" VERSION_ID="24.04" ID=ubuntu |
| CPU cores | 2 |
| Memory | total used free shared buff/cache available Mem: 3.8Gi 1.0Gi 594Mi 1.0Mi 2.5Gi 2.8Gi Swap: 0B 0B 0B |
| Root disk | Filesystem Size Used Avail Use% Mounted on /dev/vda1 77G 15G 62G 20% / |
| Block devices | NAME SIZE TYPE MOUNTPOINTS vda 80G disk ├─vda1 79G part / ├─vda14 4M part ├─vda15 106M part /boot/efi └─vda16 913M part /boot |
| Public IPv4 | 165.154.163.41 |
| Local addresses | 10.11.190.178 172.17.0.1 |

## Public IP And Port Checks

| Item | Value |
| --- | --- |
| Expected public IP | 165.154.163.41 |
| Server reported public IPv4 | 165.154.163.41 |
| Frontend URL | http://165.154.163.41:18080 |
| CMS/API URL | http://165.154.163.41:10086 |
| TCP 165.154.163.41:18080 | nc: connect to 165.154.163.41 port 18080 (tcp) failed: Connection refused |
| TCP 165.154.163.41:10086 | nc: connect to 165.154.163.41 port 10086 (tcp) failed: Connection refused |
| Frontend health over public URL | curl: (7) Failed to connect to 165.154.163.41 port 18080 after 2 ms: Couldn't connect to server
http=000 remote_ip= total=0.002072s |
| CMS health over public URL | curl: (7) Failed to connect to 165.154.163.41 port 10086 after 2 ms: Couldn't connect to server
http=000 remote_ip= total=0.002109s |
| CMS admin over public URL | curl: (7) Failed to connect to 165.154.163.41 port 10086 after 1 ms: Couldn't connect to server
http=000 remote_ip= total=0.001979s |

## DNS Checks Optional

No DNS records are required for the current IP+port deployment mode.

| Domain | A records seen from server |
| --- | --- |
| not provided | not provided |
| not provided | not provided |
| not provided | not provided |

## Network And Firewall

| Item | Value |
| --- | --- |
| Listening TCP ports | State Recv-Q Send-Q Local Address:Port Peer Address:PortProcess LISTEN 0 4096 0.0.0.0:22 0.0.0.0:* LISTEN 0 4096 127.0.0.54:53 0.0.0.0:* LISTEN 0 4096 127.0.0.53%lo:53 0.0.0.0:* LISTEN 0 4096 [::]:22 [::]:* |
| UFW status | ERROR: You need to be root to run this script |
| firewalld state | not installed |
| iptables rules | iptables v1.8.10 (nf_tables): Could not fetch rule set generation id: Permission denied (you must be root) |

## Required Outbound Connectivity

| Target | Result |
| --- | --- |
| https://registry.npmjs.org | http=200 remote_ip=104.16.1.34 total=0.056038s |
| https://registry-1.docker.io/v2/ | http=401 remote_ip=54.235.153.191 total=0.193777s |
| https://github.com | http=200 remote_ip=140.82.116.4 total=0.244489s |

## Docker

| Item | Value |
| --- | --- |
| docker version | Docker version 29.5.2, build 79eb04c |
| docker compose version | Docker Compose version v5.1.4 |
| docker service | active |
| docker ps | NAMES STATUS PORTS |
| docker disk usage | TYPE TOTAL ACTIVE SIZE RECLAIMABLE Images 2 0 11.11GB 742.4MB (6%) Containers 0 0 0B 0B Local Volumes 0 0 0B 0B Build Cache 51 0 10.72GB 10.38GB |

## Nginx And TLS Tools Optional

These are optional for the current IP+port deployment mode and only become required after switching to domain + HTTPS.

| Item | Value |
| --- | --- |
| nginx version | not installed |
| nginx service | inactive |
| certbot version | not installed |
| nginx config test | not installed |

## Project Files

| Item | Value |
| --- | --- |
| Project dir exists | yes |
| docker-compose.prod.yml exists | yes |
| .env.production exists | yes |
| Git remote | origin https://github.com/lovelycorn/frj-cms.git (fetch) origin https://github.com/lovelycorn/frj-cms.git (push) |
| Git branch | main |
| Git commit | 9e3e696 |
| Git status | ?? 11.15.0 ?? ERROR ?? [nextjs-prod] ?? [strapi-prod ?? frj-site-backend@0.1.0 ?? production-server-report.md ?? strapi |

## Production Env Status

Sensitive values are never printed. This table only reports missing, placeholder, or redacted status.

| Variable | Status |
| --- | --- |
| NODE_ENV | production |
| SITE_CODE | us |
| APP_URL | https://www.example.com (placeholder) |
| NEXT_PUBLIC_API_URL | https://cms.example.com (placeholder) |
| STRAPI_PUBLIC_URL | https://cms.example.com (placeholder) |
| STRAPI_URL | http://strapi-prod:1337 |
| NODE_IMAGE | node:20-bookworm-slim |
| POSTGRES_IMAGE | postgres:16-alpine |
| NPM_REGISTRY | https://registry.npmjs.org |
| NEXT_BIND_ADDR | 127.0.0.1 |
| STRAPI_BIND_ADDR | 127.0.0.1 |
| POSTGRES_BIND_ADDR | 127.0.0.1 |
| NEXT_PORT | 3000 |
| STRAPI_PORT | 1337 |
| POSTGRES_PORT | 5432 |
| POSTGRES_DB | frjcms |
| POSTGRES_USER | strapi |
| POSTGRES_PASSWORD | set but still looks like a default placeholder |
| DATABASE_HOST | postgres |
| DATABASE_PORT | 5432 |
| DATABASE_NAME | frjcms |
| DATABASE_USERNAME | strapi |
| DATABASE_PASSWORD | set but still looks like a default placeholder |
| DATABASE_SSL | false |
| DATABASE_URL | set, redacted, length=47 |
| APP_KEYS | set but still looks like a default placeholder |
| API_TOKEN_SALT | set but still looks like a default placeholder |
| ADMIN_JWT_SECRET | set but still looks like a default placeholder |
| TRANSFER_TOKEN_SALT | set but still looks like a default placeholder |
| JWT_SECRET | set but still looks like a default placeholder |
| ENCRYPTION_KEY | set but still looks like a default placeholder |
| STRAPI_ADMIN_EMAIL | admin@example.com (placeholder) |
| STRAPI_ADMIN_PASSWORD | set but still looks like a default placeholder |

## Expected Public Env For IP+Port Mode

| Variable | Expected value for current plan |
| --- | --- |
| APP_URL | http://165.154.163.41:18080 |
| NEXT_PUBLIC_API_URL | http://165.154.163.41:10086 |
| STRAPI_PUBLIC_URL | http://165.154.163.41:10086 |
| STRAPI_URL | http://strapi-prod:1337 |
| NEXT_BIND_ADDR | 0.0.0.0 |
| STRAPI_BIND_ADDR | 0.0.0.0 |
| POSTGRES_BIND_ADDR | 127.0.0.1 |
| NEXT_PORT | 18080 |
| STRAPI_PORT | 10086 |
| POSTGRES_PORT | 5432 |

## Compose Status

```text
NAME      IMAGE     COMMAND   SERVICE   CREATED   STATUS    PORTS

```

## Next Step

Send this report together with docs/production-info-form.md after filling the missing business/deployment decisions.