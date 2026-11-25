---
title: Host InvoiceShelf with Rustploy
description: "Invoice issuer and finance manager for freelancers. Create InvoiceShelf in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**InvoiceShelf**: Invoice issuer and finance manager for freelancers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `invoiceshelf` |
| **Containers** | 2 (`invoiceshelf-postgres`, `invoiceshelf-app`) |
| **Images** | `postgres:15`, `invoiceshelf/invoiceshelf:nightly` |
| **UI port** | 8080, on service `invoiceshelf-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **InvoiceShelf** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `db_username` | invoiceshelf |
| `db_database` | invoiceshelf |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `INVOICESHELF_HOST` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |
| `DB_USERNAME` | ${db_username} |
| `DB_DATABASE` | ${db_database} |

## Domains

| Service | Port | Host |
|---|---|---|
| `invoiceshelf-app` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  invoiceshelf-postgres:
    image: postgres:15

    volumes:
      - invoiceshelf-postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_DB=${DB_DATABASE}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  invoiceshelf-app:
    image: invoiceshelf/invoiceshelf:nightly

    volumes:
      - invoiceshelf-storage:/var/www/html/storage
    environment:
      - PHP_TZ=UTC
      - TIMEZONE=UTC
      - APP_NAME=InvoiceShelf
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_URL=http://${INVOICESHELF_HOST}
      - DB_CONNECTION=pgsql
      - DB_HOST=invoiceshelf-postgres
      - DB_PORT=5432
      - DB_DATABASE=${DB_DATABASE}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - CACHE_STORE=file
      - SESSION_DRIVER=file
      - SESSION_LIFETIME=120
      - SESSION_ENCRYPT=true
      - SESSION_PATH=/
      - SESSION_DOMAIN=${INVOICESHELF_HOST}
      - SANCTUM_STATEFUL_DOMAINS=${INVOICESHELF_HOST}
      - STARTUP_DELAY=10
    depends_on:
      invoiceshelf-postgres:
        condition: service_healthy

volumes:
  invoiceshelf-postgres-data:
  invoiceshelf-storage:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
