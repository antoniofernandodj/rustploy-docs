---
title: Hospedar Budibase com Rustploy
description: "Plataforma low-code para criação ágil de formulários e portais internos. Crie Budibase em um clique no Rustploy: 6 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Budibase**: Plataforma low-code para criação ágil de formulários e portais internos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `budibase` |
| **Containers** | 6 (`apps`, `worker`, `minio`, `proxy`, `couchdb`, `redis`) |
| **Imagens** | `budibase/apps:3.23.47`, `budibase/worker:3.23.47`, `minio/minio:RELEASE.2025-09-07T16-13-09Z`, `budibase/proxy:3.23.47`, `budibase/couchdb:v3.3.3`, `redis:8.4-alpine` |
| **Porta da interface** | 10000, no serviço `proxy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Budibase** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_key` | *senha aleatória de 32 caracteres* |
| `encryption_key` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |
| `couchdb_password` | *senha aleatória de 32 caracteres* |
| `redis_password` | *senha aleatória de 32 caracteres* |
| `minio_access_key` | *senha aleatória de 32 caracteres* |
| `minio_secret_key` | *senha aleatória de 32 caracteres* |
| `watchtower_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BB_HOST` | ${main_domain} |
| `BB_INTERNAL_API_KEY` | ${api_key} |
| `BB_API_ENCRYPTION_KEY` | ${encryption_key} |
| `BB_JWT_SECRET` | *JWT gerado* |
| `BB_COUCHDB_PASSWORD` | ${couchdb_password} |
| `BB_REDIS_PASSWORD` | ${redis_password} |
| `BB_WATCHTOWER_PASSWORD` | ${watchtower_password} |
| `BB_MINIO_ACCESS_KEY` | ${minio_access_key} |
| `BB_MINIO_SECRET_KEY` | ${minio_secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `proxy` | 10000 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
