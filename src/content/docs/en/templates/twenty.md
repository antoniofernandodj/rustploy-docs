---
title: Host Twenty with Rustploy
description: "Twenty application. Create Twenty in one click on Rustploy: 5 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Twenty**: Twenty application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `twenty` |
| **Containers** | 5 (`twenty-change-vol-ownership`, `twenty-server`, `twenty-worker`, `twenty-postgres`, `twenty-redis`) |
| **Images** | `ubuntu`, `twentycrm/twenty:latest`, `postgres:17-alpine`, `redis:latest` |
| **UI port** | 3000, on service `twenty-server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Twenty** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `db_user` | twenty |
| `app_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `HTTP_PROTOCOL` | http |
| `TWENTY_HOST` | ${main_domain} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `APP_SECRET` | ${app_secret} |
| `IS_SIGN_UP_DISABLED` | false |

## Domains

| Service | Port | Host |
|---|---|---|
| `twenty-server` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  twenty-change-vol-ownership:
    image: ubuntu
    user: root

    volumes:
      - twenty-server-local-data:/tmp/server-local-data
      - twenty-docker-data:/tmp/docker-data
    command: >
      bash -c "
      chown -R 1000:1000 /tmp/server-local-data
      && chown -R 1000:1000 /tmp/docker-data"

  twenty-server:
    image: twentycrm/twenty:latest

    volumes:
      - twenty-server-local-data:/app/packages/twenty-server/${STORAGE_LOCAL_PATH:-.local-storage}
      - twenty-docker-data:/app/docker-data
    environment:
      PORT: 3000
      SERVER_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}
      FRONT_BASE_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}

      PG_DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@twenty-postgres:5432/twenty
      ENABLE_DB_MIGRATIONS: "true"

      REDIS_URL: redis://twenty-redis:6379
      IS_SIGN_UP_DISABLED: ${IS_SIGN_UP_DISABLED:-false}
      SIGN_IN_PREFILLED: "false"

      IS_CONFIG_VARIABLES_IN_DB_ENABLED: "true"
      STORAGE_TYPE: local

      APP_SECRET: ${APP_SECRET}
    depends_on:
      twenty-change-vol-ownership:
        condition: service_completed_successfully
      twenty-postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/healthz"]
      interval: 5s
      timeout: 5s
      retries: 30
      start_period: 30s
    restart: always

  twenty-worker:
    image: twentycrm/twenty:latest

    command: ["yarn", "worker:prod"]
    environment:
      PG_DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@twenty-postgres:5432/twenty
      SERVER_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}
      FRONT_BASE_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}
      REDIS_URL: redis://twenty-redis:6379
      ENABLE_DB_MIGRATIONS: "false"
      STORAGE_TYPE: local
      APP_SECRET: ${APP_SECRET}
    depends_on:
      twenty-postgres:
        condition: service_healthy
      twenty-server:
        condition: service_healthy
    restart: always

  twenty-postgres:
    image: postgres:17-alpine

    volumes:
      - twenty-postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: twenty
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d twenty"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: always

  twenty-redis:
    image: redis:latest

    volumes:
      - twenty-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: always

volumes:
  twenty-docker-data:
  twenty-postgres-data:
  twenty-server-local-data:
  twenty-redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
