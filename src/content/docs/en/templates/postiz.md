---
title: Host Postiz with Rustploy
description: "Platform for scheduling, analyzing and publishing content across multiple channels. Create Postiz in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Postiz**: Platform for scheduling, analyzing and publishing content across multiple channels. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `postiz` |
| **Containers** | 3 (`postiz-app`, `postiz-postgres`, `postiz-redis`) |
| **Images** | `ghcr.io/gitroomhq/postiz-app:latest`, `postgres:17-alpine`, `redis:7.2` |
| **UI port** | 5000, on service `postiz-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Postiz** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `db_user` | postiz |
| `db_name` | postiz |
| `jwt_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTIZ_HOST` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |
| `DB_USER` | ${db_user} |
| `DB_NAME` | ${db_name} |
| `JWT_SECRET` | *generated JWT* |

## Domains

| Service | Port | Host |
|---|---|---|
| `postiz-app` | 5000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  postiz-app:
    image: ghcr.io/gitroomhq/postiz-app:latest
    restart: always

    environment:
      MAIN_URL: "https://${POSTIZ_HOST}"
      FRONTEND_URL: "https://${POSTIZ_HOST}"
      NEXT_PUBLIC_BACKEND_URL: "https://${POSTIZ_HOST}/api"
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: "postgresql://${DB_USER}:${DB_PASSWORD}@postiz-postgres:5432/${DB_NAME}"
      REDIS_URL: "redis://postiz-redis:6379"
      BACKEND_INTERNAL_URL: "http://localhost:3000"
      IS_GENERAL: "true"
      STORAGE_PROVIDER: "local"
      UPLOAD_DIRECTORY: "/uploads"
      NEXT_PUBLIC_UPLOAD_DIRECTORY: "/uploads"
    volumes:
      - postiz-config:/config/
      - postiz-uploads:/uploads/
    depends_on:
      postiz-postgres:
        condition: service_healthy
      postiz-redis:
        condition: service_healthy

  postiz-postgres:
    image: postgres:17-alpine
    restart: always

    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postiz-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: pg_isready -U ${DB_USER} -d ${DB_NAME}
      interval: 10s
      timeout: 3s
      retries: 3

  postiz-redis:
    image: redis:7.2
    restart: always

    healthcheck:
      test: redis-cli ping
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - postiz-redis-data:/data

volumes:
  postiz-postgres-data:
  postiz-redis-data:
  postiz-config:
  postiz-uploads:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
