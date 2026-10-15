---
title: Host MediaCMS with Rustploy
description: "Modern CMS for video streaming, channels and media sharing. Create MediaCMS in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**MediaCMS**: Modern CMS for video streaming, channels and media sharing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mediacms` |
| **Containers** | 6 (`migrations`, `web`, `celery_beat`, `celery_worker`, `db`, `redis`) |
| **Images** | `mediacms/mediacms:latest`, `postgres:17.2-alpine`, `redis:alpine` |
| **UI port** | 80, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **MediaCMS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `admin_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  migrations:
    image: mediacms/mediacms:latest
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_UWSGI: 'no'
      ENABLE_NGINX: 'no'
      ENABLE_CELERY_SHORT: 'no'
      ENABLE_CELERY_LONG: 'no'
      ENABLE_CELERY_BEAT: 'no'
      ENABLE_MIGRATIONS: 'yes'
      ADMIN_USER: 'admin'
      ADMIN_EMAIL: 'admin@localhost'
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    command: "./deploy/docker/prestart.sh"
    restart: on-failure
    depends_on:
      redis:
        condition: service_healthy
      db:
        condition: service_healthy

  web:
    image: mediacms/mediacms:latest
    deploy:
      replicas: 1
    ports:
      - 80
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_CELERY_BEAT: 'no'
      ENABLE_CELERY_SHORT: 'no'
      ENABLE_CELERY_LONG: 'no'
      ENABLE_MIGRATIONS: 'no'
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - migrations

  celery_beat:
    image: mediacms/mediacms:latest
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_UWSGI: 'no'
      ENABLE_NGINX: 'no'
      ENABLE_CELERY_SHORT: 'no'
      ENABLE_CELERY_LONG: 'no'
      ENABLE_MIGRATIONS: 'no'
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - redis

  celery_worker:
    image: mediacms/mediacms:latest
    deploy:
      replicas: 1
    volumes:
      - mediacms_data:/home/mediacms.io/mediacms/media
      - mediacms_static:/home/mediacms.io/mediacms/staticfiles
    environment:
      ENABLE_UWSGI: 'no'
      ENABLE_NGINX: 'no'
      ENABLE_CELERY_BEAT: 'no'
      ENABLE_MIGRATIONS: 'no'
      DATABASE_HOST: db
      DATABASE_PORT: 5432
      DATABASE_USER: mediacms
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    depends_on:
      - migrations

  db:
    image: postgres:17.2-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    restart: always
    environment:
      POSTGRES_USER: mediacms
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: mediacms
      TZ: Europe/London
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: "redis:alpine"
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli","ping"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  postgres_data:
  mediacms_data:
  mediacms_static:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
