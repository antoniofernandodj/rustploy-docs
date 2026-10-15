---
title: Host Misaka Danmu Server with Rustploy
description: "Server dedicated to managing floating comments (danmaku) for streams. Create Misaka Danmu Server in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Misaka Danmu Server**: Server dedicated to managing floating comments (danmaku) for streams. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `misaka-danmu-server` |
| **Containers** | 2 (`postgres`, `danmu-app`) |
| **Images** | `postgres:18`, `l429609201/misaka_danmu_server:latest` |
| **UI port** | 7768, on service `danmu-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Misaka Danmu Server** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 24 characters* |
| `db_user` | danmuapi |
| `db_name` | danmuapi |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${db_password} |
| `POSTGRES_USER` | ${db_user} |
| `POSTGRES_DB` | ${db_name} |
| `DANMUAPI_DATABASE__TYPE` | postgresql |
| `DANMUAPI_DATABASE__HOST` | postgres |
| `DANMUAPI_DATABASE__PORT` | 5432 |
| `DANMUAPI_DATABASE__NAME` | ${db_name} |
| `DANMUAPI_DATABASE__USER` | ${db_user} |
| `DANMUAPI_DATABASE__PASSWORD` | ${db_password} |
| `DANMUAPI_ADMIN__INITIAL_USER` | admin |

## Domains

| Service | Port | Host |
|---|---|---|
| `danmu-app` | 7768 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:18
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD
      - POSTGRES_USER
      - POSTGRES_DB
      - TZ=Asia/Shanghai
    volumes:
      - postgres-data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U danmuapi -d danmuapi"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 60s

  danmu-app:
    image: l429609201/misaka_danmu_server:latest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK=0022
      - TZ=Asia/Shanghai
      - DANMUAPI_DATABASE__TYPE
      - DANMUAPI_DATABASE__HOST
      - DANMUAPI_DATABASE__PORT
      - DANMUAPI_DATABASE__NAME
      - DANMUAPI_DATABASE__USER
      - DANMUAPI_DATABASE__PASSWORD
      - DANMUAPI_ADMIN__INITIAL_USER
    volumes:
      - danmu-config:/app/config

volumes:
  postgres-data: {}
  danmu-config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
