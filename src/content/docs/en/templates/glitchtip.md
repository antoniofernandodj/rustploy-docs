---
title: Host Glitchtip with Rustploy
description: "Centralized, simplified application error collector (Sentry alternative). Create Glitchtip in one click on Rustploy: 5 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Glitchtip**: Centralized, simplified application error collector (Sentry alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `glitchtip` |
| **Containers** | 5 (`postgres`, `redis`, `web`, `worker`, `migrate`) |
| **Images** | `postgres:16`, `redis`, `glitchtip/glitchtip:v4.0` |
| **UI port** | 8000, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Glitchtip** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `GLITCHTIP_HOST` | ${main_domain} |
| `GLITCHTIP_PORT` | 8000 |
| `SECRET_KEY` | ${secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
x-environment: &default-environment
  DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
  SECRET_KEY: ${SECRET_KEY}
  PORT: ${GLITCHTIP_PORT}
  EMAIL_URL: consolemail://
  GLITCHTIP_DOMAIN: http://${GLITCHTIP_HOST}
  DEFAULT_FROM_EMAIL: email@glitchtip.com
  CELERY_WORKER_AUTOSCALE: "1,3"
  CELERY_WORKER_MAX_TASKS_PER_CHILD: "10000"

x-depends_on: &default-depends_on
  - postgres
  - redis

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_HOST_AUTH_METHOD: "trust"
    restart: unless-stopped
    volumes:
      - pg-data:/var/lib/postgresql/data

  redis:
    image: redis
    restart: unless-stopped

  web:
    image: glitchtip/glitchtip:v4.0
    depends_on: *default-depends_on
    ports:
      - ${GLITCHTIP_PORT}
    environment: *default-environment
    restart: unless-stopped
    volumes:
      - uploads:/code/uploads
  worker:
    image: glitchtip/glitchtip:v4.0
    command: ./bin/run-celery-with-beat.sh
    depends_on: *default-depends_on
    environment: *default-environment
    restart: unless-stopped
    volumes:
      - uploads:/code/uploads

  migrate:
    image: glitchtip/glitchtip:v4.0
    depends_on: *default-depends_on
    command: "./manage.py migrate"
    environment: *default-environment


volumes:
  pg-data:
  uploads:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
