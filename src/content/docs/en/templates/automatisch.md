---
title: Host Automatisch with Rustploy
description: "Automatisch application. Create Automatisch in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Automatisch**: Automatisch application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `automatisch` |
| **Containers** | 4 (`automatisch`, `automatisch-worker`, `automatisch-postgres`, `automatisch-redis`) |
| **Images** | `dockeriddonuts/automatisch:2.0`, `postgres:15-alpine`, `redis:7-alpine` |
| **UI port** | 3000, on service `automatisch` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Automatisch** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |
| `redis_password` | *random password, 16 characters* |
| `encryption_key` | *random password, 32 characters* |
| `webhook_secret_key` | *random password, 32 characters* |
| `app_secret_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `ENCRYPTION_KEY` | ${encryption_key} |
| `WEBHOOK_SECRET_KEY` | ${webhook_secret_key} |
| `APP_SECRET_KEY` | ${app_secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `automatisch` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  automatisch:
    image: dockeriddonuts/automatisch:2.0
    restart: unless-stopped
    ports:
      - 3000
    environment:
      - HOST=${DOMAIN}
      - PROTOCOL=http
      - PORT=3000
      - APP_ENV=production
      - REDIS_HOST=automatisch-redis
      - REDIS_USERNAME=default
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - POSTGRES_HOST=automatisch-postgres
      - POSTGRES_DATABASE=automatisch
      - POSTGRES_USERNAME=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - WEBHOOK_SECRET_KEY=${WEBHOOK_SECRET_KEY}
      - APP_SECRET_KEY=${APP_SECRET_KEY}
    volumes:
      - storage:/automatisch/storage
    depends_on:
      - automatisch-postgres
      - automatisch-redis

  automatisch-worker:
    image: dockeriddonuts/automatisch:2.0
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - REDIS_HOST=automatisch-redis
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - POSTGRES_HOST=automatisch-postgres
      - POSTGRES_DATABASE=automatisch
      - POSTGRES_USERNAME=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - WEBHOOK_SECRET_KEY=${WEBHOOK_SECRET_KEY}
      - APP_SECRET_KEY=${APP_SECRET_KEY}
      - WORKER=true
    volumes:
      - storage:/automatisch/storage
    depends_on:
      - automatisch-postgres
      - automatisch-redis

  automatisch-postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=automatisch
    volumes:
      - postgres_data:/var/lib/postgresql/data

  automatisch-redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    environment:
      - REDIS_USERNAME=default
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

volumes:
  storage: {}
  postgres_data: {}
  redis_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
