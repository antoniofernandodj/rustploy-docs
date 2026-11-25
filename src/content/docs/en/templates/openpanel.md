---
title: Host OpenPanel with Rustploy
description: "Privacy-focused web analytics, a clean replacement for Google Analytics or Mixpanel. Create OpenPanel in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**OpenPanel**: Privacy-focused web analytics, a clean replacement for Google Analytics or Mixpanel. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `openpanel` |
| **Containers** | 6 (`op-db`, `op-kv`, `op-ch`, `op-api`, `op-dashboard`, `op-worker`) |
| **Images** | `postgres:14-alpine`, `redis:7.2.5-alpine`, `clickhouse/clickhouse-server:25.10.2.65`, `lindesvard/openpanel-api:2`, `lindesvard/openpanel-dashboard:2`, `lindesvard/openpanel-worker:2` |
| **UI port** | 3000, on service `op-dashboard` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **OpenPanel** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `cookie_secret` | *random base64 key (32 bytes)* |
| `redis_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DASHBOARD_URL` | http://${main_domain} |
| `API_URL` | http://${main_domain}/api |
| `POSTGRES_DB` | openpanel |
| `POSTGRES_USER` | openpanel |
| `POSTGRES_PASSWORD` | ${db_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `COOKIE_SECRET` | ${cookie_secret} |
| `ALLOW_REGISTRATION` | true |
| `ALLOW_INVITATION` | true |
| `EMAIL_SENDER` |  |
| `RESEND_API_KEY` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `op-dashboard` | 3000 | ${main_domain} |
| `op-api` | 3000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./clickhouse_config/op-config.xml`
- `./clickhouse_users/op-user-config.xml`
- `./clickhouse_init/1_init-db.sql`

## The template docker-compose.yml

```yaml
x-common: &x-common
  NODE_ENV: production
  SELF_HOSTED: "true"
  API_URL: ${API_URL}
  DASHBOARD_URL: ${DASHBOARD_URL}
  DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@op-db:5432/${POSTGRES_DB}?schema=public
  DATABASE_URL_DIRECT: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@op-db:5432/${POSTGRES_DB}?schema=public
  REDIS_URL: redis://default:${REDIS_PASSWORD}@op-kv:6379
  CLICKHOUSE_URL: http://op-ch:8123/openpanel

services:
  op-db:
    image: postgres:14-alpine
    restart: always
    volumes:
      - op-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}']
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  op-kv:
    image: redis:7.2.5-alpine
    restart: always
    volumes:
      - op-kv-data:/data
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory-policy noeviction
    healthcheck:
      test: ['CMD', 'redis-cli', '-a', '${REDIS_PASSWORD}', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  op-ch:
    image: clickhouse/clickhouse-server:25.10.2.65
    restart: always
    volumes:
      - op-ch-data:/var/lib/clickhouse
      - op-ch-logs:/var/log/clickhouse-server
      - ../files/clickhouse_config:/etc/clickhouse-server/config.d
      - ../files/clickhouse_users:/etc/clickhouse-server/users.d
      - ../files/clickhouse_init:/docker-entrypoint-initdb.d
    environment:
      - CLICKHOUSE_SKIP_USER_SETUP=1
    healthcheck:
      test: ['CMD-SHELL', 'clickhouse-client --query "SELECT 1" -d openpanel']
      interval: 10s
      timeout: 5s
      retries: 5

  op-api:
    image: lindesvard/openpanel-api:2
    restart: always
    command: >
      sh -c "
        echo 'Waiting for PostgreSQL to be ready...'
        while ! nc -z op-db 5432; do
          sleep 1
        done
        echo 'PostgreSQL is ready'

        echo 'Waiting for ClickHouse to be ready...'
        while ! nc -z op-ch 8123; do
          sleep 1
        done
        echo 'ClickHouse is ready'

        echo 'Running migrations...'

        CI=true pnpm -r run migrate:deploy

        pnpm start
      "
    environment:
      COOKIE_SECRET: ${COOKIE_SECRET}
      ALLOW_REGISTRATION: ${ALLOW_REGISTRATION}
      ALLOW_INVITATION: ${ALLOW_INVITATION}
      EMAIL_SENDER: ${EMAIL_SENDER}
      RESEND_API_KEY: ${RESEND_API_KEY}
      <<: *x-common
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/healthcheck || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5
    depends_on:
      op-db:
        condition: service_healthy
      op-ch:
        condition: service_healthy
      op-kv:
        condition: service_healthy

  op-dashboard:
    image: lindesvard/openpanel-dashboard:2
    restart: always
    depends_on:
      op-api:
        condition: service_healthy
    environment:
      <<: *x-common
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/api/healthcheck || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5

  op-worker:
    image: lindesvard/openpanel-worker:2
    restart: always
    depends_on:
      op-api:
        condition: service_healthy
    environment:
      <<: *x-common
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/healthcheck || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  op-db-data:
  op-kv-data:
  op-ch-data:
  op-ch-logs:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
