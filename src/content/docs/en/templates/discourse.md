---
title: Host Discourse with Rustploy
description: "Modern platform for discussion forums and communities. Create Discourse in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Discourse**: Modern platform for discussion forums and communities. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `discourse` |
| **Containers** | 4 (`discourse-db`, `discourse-redis`, `discourse-app`, `discourse-sidekiq`) |
| **Images** | `docker.io/bitnami/postgresql:17`, `docker.io/bitnami/redis:7.4`, `docker.io/bitnamilegacy/discourse:3.5.0` |
| **UI port** | 3000, on service `discourse-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Discourse** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `redis_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DISCOURSE_HOST` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_PASSWORD` | ${redis_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `discourse-app` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.7'

services:
  discourse-db:
    image: docker.io/bitnami/postgresql:17

    volumes:
      - discourse-postgresql-data:/bitnami/postgresql
    environment:
      POSTGRESQL_USERNAME: bn_discourse
      POSTGRESQL_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRESQL_DATABASE: bitnami_discourse
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bn_discourse -d bitnami_discourse"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  discourse-redis:
    image: docker.io/bitnami/redis:7.4

    volumes:
      - discourse-redis-data:/bitnami/redis
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  discourse-app:
    image: docker.io/bitnamilegacy/discourse:3.5.0

    volumes:
      - discourse-data:/bitnami/discourse
    depends_on:
      discourse-db:
        condition: service_healthy
      discourse-redis:
        condition: service_healthy
    environment:
      DISCOURSE_HOST: ${DISCOURSE_HOST}
      DISCOURSE_DATABASE_HOST: discourse-db
      DISCOURSE_DATABASE_PORT_NUMBER: 5432
      DISCOURSE_DATABASE_USER: bn_discourse
      DISCOURSE_DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DISCOURSE_DATABASE_NAME: bitnami_discourse
      DISCOURSE_REDIS_HOST: discourse-redis
      DISCOURSE_REDIS_PORT_NUMBER: 6379
      DISCOURSE_REDIS_PASSWORD: ${REDIS_PASSWORD}
      # Optional: Configure SMTP for email delivery
      # DISCOURSE_SMTP_HOST: ${SMTP_HOST}
      # DISCOURSE_SMTP_PORT: ${SMTP_PORT}
      # DISCOURSE_SMTP_USER: ${SMTP_USER}
      # DISCOURSE_SMTP_PASSWORD: ${SMTP_PASSWORD}
    restart: unless-stopped

  discourse-sidekiq:
    image: docker.io/bitnamilegacy/discourse:3.5.0

    volumes:
      - discourse-sidekiq-data:/bitnami/discourse
    depends_on:
      - discourse-app
    command: /opt/bitnami/scripts/discourse-sidekiq/run.sh
    environment:
      DISCOURSE_HOST: ${DISCOURSE_HOST}
      DISCOURSE_DATABASE_HOST: discourse-db
      DISCOURSE_DATABASE_PORT_NUMBER: 5432
      DISCOURSE_DATABASE_USER: bn_discourse
      DISCOURSE_DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DISCOURSE_DATABASE_NAME: bitnami_discourse
      DISCOURSE_REDIS_HOST: discourse-redis
      DISCOURSE_REDIS_PORT_NUMBER: 6379
      DISCOURSE_REDIS_PASSWORD: ${REDIS_PASSWORD}
      # Optional: Configure SMTP for email delivery
      # DISCOURSE_SMTP_HOST: ${SMTP_HOST}
      # DISCOURSE_SMTP_PORT: ${SMTP_PORT}
      # DISCOURSE_SMTP_USER: ${SMTP_USER}
      # DISCOURSE_SMTP_PASSWORD: ${SMTP_PASSWORD}
    restart: unless-stopped

volumes:
  discourse-postgresql-data:
  discourse-redis-data:
  discourse-data:
  discourse-sidekiq-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
