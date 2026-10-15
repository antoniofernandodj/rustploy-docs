---
title: Host WuzAPI with Rustploy
description: "Lightweight RESTful API for multi-device integration and automation with WhatsApp accounts. Create WuzAPI in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**WuzAPI**: Lightweight RESTful API for multi-device integration and automation with WhatsApp accounts. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `wuzapi` |
| **Containers** | 2 (`wuzapi-server`, `db`) |
| **Images** | `asternic/wuzapi:sha-30c1805`, `postgres:16-alpine` |
| **UI port** | 8080, on service `wuzapi-server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **WuzAPI** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_token` | *random password, 32 characters* |
| `encryption_key` | *random password, 32 characters* |
| `db_user` | wuzapi |
| `db_password` | *random password, 32 characters* |
| `db_name` | wuzapi |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `WUZAPI_ADMIN_TOKEN` | ${admin_token} |
| `WUZAPI_GLOBAL_ENCRYPTION_KEY` | ${encryption_key} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_NAME` | ${db_name} |

## Domains

| Service | Port | Host |
|---|---|---|
| `wuzapi-server` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  wuzapi-server:
    image: asternic/wuzapi:sha-30c1805
    restart: unless-stopped
    expose:
      - 8080
    environment:
      - WUZAPI_ADMIN_TOKEN=${WUZAPI_ADMIN_TOKEN}
      - WUZAPI_GLOBAL_ENCRYPTION_KEY=${WUZAPI_GLOBAL_ENCRYPTION_KEY}
      - DB_USER=${DB_USER:-wuzapi}
      - DB_PASSWORD=${DB_PASSWORD:-wuzapi}
      - DB_NAME=${DB_NAME:-wuzapi}
      - DB_HOST=db
      - DB_PORT=5432
      - TZ=${TZ:-UTC}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-wuzapi}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-wuzapi}
      POSTGRES_DB: ${DB_NAME:-wuzapi}
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${DB_USER:-wuzapi}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  db_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
