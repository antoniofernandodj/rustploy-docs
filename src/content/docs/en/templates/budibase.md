---
title: Host Budibase with Rustploy
description: "Low-code platform for quickly building forms and internal portals. Create Budibase in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Budibase**: Low-code platform for quickly building forms and internal portals. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `budibase` |
| **Containers** | 6 (`apps`, `worker`, `minio`, `proxy`, `couchdb`, `redis`) |
| **Images** | `budibase/apps:3.23.47`, `budibase/worker:3.23.47`, `minio/minio:RELEASE.2025-09-07T16-13-09Z`, `budibase/proxy:3.23.47`, `budibase/couchdb:v3.3.3`, `redis:8.4-alpine` |
| **UI port** | 10000, on service `proxy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Budibase** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_key` | *random password, 32 characters* |
| `encryption_key` | *random password, 32 characters* |
| `jwt_secret` | *random password, 32 characters* |
| `couchdb_password` | *random password, 32 characters* |
| `redis_password` | *random password, 32 characters* |
| `minio_access_key` | *random password, 32 characters* |
| `minio_secret_key` | *random password, 32 characters* |
| `watchtower_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BB_HOST` | ${main_domain} |
| `BB_INTERNAL_API_KEY` | ${api_key} |
| `BB_API_ENCRYPTION_KEY` | ${encryption_key} |
| `BB_JWT_SECRET` | *generated JWT* |
| `BB_COUCHDB_PASSWORD` | ${couchdb_password} |
| `BB_REDIS_PASSWORD` | ${redis_password} |
| `BB_WATCHTOWER_PASSWORD` | ${watchtower_password} |
| `BB_MINIO_ACCESS_KEY` | ${minio_access_key} |
| `BB_MINIO_SECRET_KEY` | ${minio_secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `proxy` | 10000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:

  apps:
    image: budibase/apps:3.23.47
    restart: unless-stopped
    environment:
      SELF_HOSTED: 1
      LOG_LEVEL: info
      PORT: 4002
      INTERNAL_API_KEY: ${BB_INTERNAL_API_KEY}
      API_ENCRYPTION_KEY: ${BB_API_ENCRYPTION_KEY}
      JWT_SECRET: ${BB_JWT_SECRET}
      MINIO_ACCESS_KEY: ${BB_MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${BB_MINIO_SECRET_KEY}
      MINIO_URL: http://minio:9000
      REDIS_URL: redis:6379
      REDIS_PASSWORD: ${BB_REDIS_PASSWORD}
      WORKER_URL: http://worker:4003
      COUCH_DB_USERNAME: budibase
      COUCH_DB_PASSWORD: ${BB_COUCHDB_PASSWORD}
      COUCH_DB_URL: http://budibase:${BB_COUCHDB_PASSWORD}@couchdb:5984
      BUDIBASE_ENVIRONMENT: ${BUDIBASE_ENVIRONMENT:-PRODUCTION}
      ENABLE_ANALYTICS: ${ENABLE_ANALYTICS:-true}
      BB_ADMIN_USER_EMAIL: ''
      BB_ADMIN_USER_PASSWORD: ''
    depends_on:
      worker:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test:
        - CMD
        - wget
        - '--spider'
        - '-qO-'
        - 'http://localhost:4002/health'
      interval: 15s
      timeout: 15s
      retries: 5
      start_period: 10s

  worker:
    image: budibase/worker:3.23.47
    restart: unless-stopped
    environment:
      SELF_HOSTED: 1
      LOG_LEVEL: info
      PORT: 4003
      CLUSTER_PORT: 10000
      INTERNAL_API_KEY: ${BB_INTERNAL_API_KEY}
      API_ENCRYPTION_KEY: ${BB_API_ENCRYPTION_KEY}
      JWT_SECRET: ${BB_JWT_SECRET}
      MINIO_ACCESS_KEY: ${BB_MINIO_ACCESS_KEY}
      MINIO_SECRET_KEY: ${BB_MINIO_SECRET_KEY}
      APPS_URL: http://apps:4002
      MINIO_URL: http://minio:9000
      REDIS_URL: redis:6379
      REDIS_PASSWORD: ${BB_REDIS_PASSWORD}
      COUCH_DB_USERNAME: budibase
      COUCH_DB_PASSWORD: ${BB_COUCHDB_PASSWORD}
      COUCH_DB_URL: http://budibase:${BB_COUCHDB_PASSWORD}@couchdb:5984
      BUDIBASE_ENVIRONMENT: ${BUDIBASE_ENVIRONMENT:-PRODUCTION}
      ENABLE_ANALYTICS: ${ENABLE_ANALYTICS:-true}
    depends_on:
      redis:
        condition: service_healthy
      minio:
        condition: service_healthy
    healthcheck:
      test:
        - CMD
        - wget
        - '--spider'
        - '-qO-'
        - 'http://localhost:4003/health'
      interval: 15s
      timeout: 15s
      retries: 5
      start_period: 10s

  minio:
    image: minio/minio:RELEASE.2025-09-07T16-13-09Z
    restart: unless-stopped
    volumes:
      - 'minio_data:/data'
    environment:
      MINIO_ROOT_USER: ${BB_MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${BB_MINIO_SECRET_KEY}
      MINIO_BROWSER: off
    command: 'server /data --console-address ":9001"'
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://localhost:9000/minio/health/live'
      interval: 30s
      timeout: 20s
      retries: 3

  proxy:
    image: budibase/proxy:3.23.47
    restart: unless-stopped
    environment:
      PROXY_RATE_LIMIT_WEBHOOKS_PER_SECOND: 10
      PROXY_RATE_LIMIT_API_PER_SECOND: 20
      APPS_UPSTREAM_URL: http://apps:4002
      WORKER_UPSTREAM_URL: http://worker:4003
      MINIO_UPSTREAM_URL: http://minio:9000
      COUCHDB_UPSTREAM_URL: http://couchdb:5984
      WATCHTOWER_UPSTREAM_URL: http://watchtower:8080
      RESOLVER: 127.0.0.11
    depends_on:
      minio:
        condition: service_healthy
      worker:
        condition: service_healthy
      apps:
        condition: service_healthy
      couchdb:
        condition: service_healthy
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://localhost:10000/'
      interval: 15s
      timeout: 15s
      retries: 5
      start_period: 10s

  couchdb:
    image: budibase/couchdb:v3.3.3
    restart: unless-stopped
    environment:
      COUCHDB_USER: budibase
      COUCHDB_PASSWORD: ${BB_COUCHDB_PASSWORD}
      TARGETBUILD: docker-compose
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://localhost:5984/'
      interval: 15s
      timeout: 15s
      retries: 5
      start_period: 10s
    volumes:
      - 'couchdb3_data:/opt/couchdb/data'

  redis:
    image: redis:8.4-alpine
    restart: unless-stopped
    command: 'redis-server --requirepass "${BB_REDIS_PASSWORD}"'
    volumes:
      - 'redis_data:/data'
    healthcheck:
      test:
        - CMD
        - redis-cli
        - '-a'
        - ${BB_REDIS_PASSWORD}
        - ping
      interval: 15s
      timeout: 15s
      retries: 5
      start_period: 10s


volumes:
  minio_data:
  couchdb3_data:
  redis_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
