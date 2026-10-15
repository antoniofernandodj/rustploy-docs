---
title: Host Chatwoot with Rustploy
description: "Omnichannel customer support platform (Live Chat, WhatsApp, social networks). Create Chatwoot in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Chatwoot**: Omnichannel customer support platform (Live Chat, WhatsApp, social networks). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `chatwoot` |
| **Containers** | 4 (`chatwoot-rails`, `chatwoot-sidekiq`, `chatwoot-postgres`, `chatwoot-redis`) |
| **Images** | `pgvector/pgvector:pg14`, `redis:alpine` |
| **UI port** | 3000, on service `chatwoot-rails` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Chatwoot** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key_base` | *random base64 key (64 bytes)* |
| `postgres_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `FRONTEND_URL` | http://${main_domain} |
| `SECRET_KEY_BASE` | ${secret_key_base} |
| `RAILS_ENV` | production |
| `NODE_ENV` | production |
| `INSTALLATION_ENV` | docker |
| `RAILS_LOG_TO_STDOUT` | true |
| `LOG_LEVEL` | info |
| `DEFAULT_LOCALE` | en |
| `POSTGRES_HOST` | chatwoot-postgres |
| `POSTGRES_PORT` | 5432 |
| `POSTGRES_DATABASE` | chatwoot |
| `POSTGRES_USERNAME` | postgres |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_URL` | redis://chatwoot-redis:6379 |
| `ENABLE_ACCOUNT_SIGNUP` | false |
| `ACTIVE_STORAGE_SERVICE` | local |

## Domains

| Service | Port | Host |
|---|---|---|
| `chatwoot-rails` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3'

x-base-config: &base-config
  image: chatwoot/chatwoot:v4.0.3
  volumes:
    - chatwoot-storage:/app/storage
  environment:
    - FRONTEND_URL=${FRONTEND_URL}
    - SECRET_KEY_BASE=${SECRET_KEY_BASE}
    - RAILS_ENV=${RAILS_ENV}
    - NODE_ENV=${NODE_ENV}
    - INSTALLATION_ENV=${INSTALLATION_ENV}
    - RAILS_LOG_TO_STDOUT=${RAILS_LOG_TO_STDOUT}
    - LOG_LEVEL=${LOG_LEVEL}
    - DEFAULT_LOCALE=${DEFAULT_LOCALE}
    - POSTGRES_HOST=${POSTGRES_HOST}
    - POSTGRES_PORT=${POSTGRES_PORT}
    - POSTGRES_DATABASE=${POSTGRES_DATABASE}
    - POSTGRES_USERNAME=${POSTGRES_USERNAME}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - REDIS_URL=${REDIS_URL}
    - ENABLE_ACCOUNT_SIGNUP=${ENABLE_ACCOUNT_SIGNUP}
    - ACTIVE_STORAGE_SERVICE=${ACTIVE_STORAGE_SERVICE}

services:
  chatwoot-rails:
    <<: *base-config
    depends_on:
      chatwoot-postgres:
        condition: service_started
      chatwoot-redis:
        condition: service_started
    entrypoint: docker/entrypoints/rails.sh
    command: ['bundle', 'exec', 'sh', '-c', 'rails db:chatwoot_prepare && rails s -p 3000 -b 0.0.0.0']
    restart: always

  chatwoot-sidekiq:
    <<: *base-config
    depends_on:
      chatwoot-postgres:
        condition: service_started
      chatwoot-redis:
        condition: service_started
    command: ['bundle', 'exec', 'sidekiq', '-C', 'config/sidekiq.yml']
    restart: always

  chatwoot-postgres:
    image: pgvector/pgvector:pg14
    restart: always
    volumes:
      - chatwoot-postgres-data:/var/lib/postgresql/data
      - ./init-vector.sql:/docker-entrypoint-initdb.d/init-vector.sql
    environment:
      - POSTGRES_DB=${POSTGRES_DATABASE}
      - POSTGRES_USER=${POSTGRES_USERNAME}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  chatwoot-redis:
    image: redis:alpine
    restart: always
    volumes:
      - chatwoot-redis-data:/data

volumes:
  chatwoot-storage:
  chatwoot-postgres-data:
  chatwoot-redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
