---
title: Host Ryot with Rustploy
description: "Unified system to log and catalog consumed media (books, movies, games). Create Ryot in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ryot**: Unified system to log and catalog consumed media (books, movies, games). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ryot` |
| **Containers** | 2 (`ryot-app`, `ryot-db`) |
| **Images** | `ignisda/ryot:v7.10`, `postgres:16-alpine` |
| **UI port** | 8000, on service `ryot-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ryot** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `admin_access_token` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ADMIN_ACCESS_TOKEN` | ${admin_access_token} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ryot-app` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.7'

services:
  ryot-app:
    image: ignisda/ryot:v7.10

    environment:
      - DATABASE_URL=postgres://postgres:${POSTGRES_PASSWORD}@ryot-db:5432/postgres
      - SERVER_ADMIN_ACCESS_TOKEN=${ADMIN_ACCESS_TOKEN}
      - TZ=UTC
      # Optional: Uncomment and set your pro key if you have one
      # - SERVER_PRO_KEY=${SERVER_PRO_KEY}
    depends_on:
      ryot-db:
        condition: service_healthy
    restart: always
    pull_policy: always

  ryot-db:
    image: postgres:16-alpine

    volumes:
      - ryot-postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=postgres
      - POSTGRES_DB=postgres
      - TZ=UTC
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  ryot-postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
