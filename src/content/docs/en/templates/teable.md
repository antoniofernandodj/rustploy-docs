---
title: Host Teable with Rustploy
description: "Postgres-based database with a very high-performance visual spreadsheet interface. Create Teable in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Teable**: Postgres-based database with a very high-performance visual spreadsheet interface. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `teable` |
| **Containers** | 3 (`teable`, `teable-db`, `teable-db-migrate`) |
| **Images** | `ghcr.io/teableio/teable:latest`, `postgres:15.4`, `ghcr.io/teableio/teable-db-migrate:latest` |
| **UI port** | 3000, on service `teable` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Teable** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `public_db_port` | ${randomPort} |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TEABLE_HOST` | ${main_domain} |
| `TEABLE_DB_PORT` | ${public_db_port} |
| `TIMEZONE` | UTC |
| `POSTGRES_HOST` | teable-db |
| `POSTGRES_PORT` | 5432 |
| `POSTGRES_DB` | teable |
| `POSTGRES_USER` | teable |
| `POSTGRES_PASSWORD` | ${db_password} |
| `PUBLIC_ORIGIN` | https://${main_domain} |
| `PRISMA_DATABASE_URL` | postgresql://teable:${db_password}@teable-db:5432/teable |
| `PUBLIC_DATABASE_PROXY` | ${TEABLE_HOST}:${TEABLE_DB_PORT} |

## Domains

| Service | Port | Host |
|---|---|---|
| `teable` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.9"

services:
  teable:
    image: ghcr.io/teableio/teable:latest
    restart: always
    volumes:
      - teable-data:/app/.assets
      # you may use a bind-mounted host directory instead,
      # so that it is harder to accidentally remove the volume and lose all your data!
      # - ./docker/teable/data:/app/.assets:rw
    environment:
      - TZ=${TIMEZONE}
      - NEXT_ENV_IMAGES_ALL_REMOTE=true
      - PUBLIC_ORIGIN=${PUBLIC_ORIGIN}
      - PRISMA_DATABASE_URL=${PRISMA_DATABASE_URL}
      - PUBLIC_DATABASE_PROXY=${PUBLIC_DATABASE_PROXY}
      - BACKEND_MAIL_HOST=${BACKEND_MAIL_HOST}
      - BACKEND_MAIL_PORT=${BACKEND_MAIL_PORT}
      - BACKEND_MAIL_SECURE=${BACKEND_MAIL_SECURE}
      - BACKEND_MAIL_SENDER=${BACKEND_MAIL_SENDER}
      - BACKEND_MAIL_SENDER_NAME=${BACKEND_MAIL_SENDER_NAME}
      - BACKEND_MAIL_AUTH_USER=${BACKEND_MAIL_AUTH_USER}
      - BACKEND_MAIL_AUTH_PASS=${BACKEND_MAIL_AUTH_PASS}
    depends_on:
      teable-db-migrate:
        condition: service_completed_successfully

  teable-db:
    image: postgres:15.4
    restart: always
    ports:
      - "${TEABLE_DB_PORT}:${POSTGRES_PORT}"
    volumes:
      - teable-db:/var/lib/postgresql/data
      # you may use a bind-mounted host directory instead,
      # so that it is harder to accidentally remove the volume and lose all your data!
      # - ./docker/db/data:/var/lib/postgresql/data:rw
    environment:
      - TZ=${TIMEZONE}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

    healthcheck:
      test:
        [
          "CMD-SHELL",
          "sh -c 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}'",
        ]
      interval: 10s
      timeout: 3s
      retries: 3

  teable-db-migrate:
    image: ghcr.io/teableio/teable-db-migrate:latest
    environment:
      - TZ=${TIMEZONE}
      - PRISMA_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

    depends_on:
      teable-db:
        condition: service_healthy

volumes:
  teable-data: {}
  teable-db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
