---
title: Host Picsur with Rustploy
description: "Simplified image hosting server built on PostgreSQL. Create Picsur in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Picsur**: Simplified image hosting server built on PostgreSQL. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `picsur` |
| **Containers** | 2 (`picsur`, `picsur_postgres`) |
| **Images** | `ghcr.io/caramelfur/picsur:latest`, `postgres:17-alpine` |
| **UI port** | 8080, on service `picsur` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Picsur** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `admin_password` | *random password, 32 characters* |
| `jwt_secret` | *generated JWT* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PICSUR_DB_PASSWORD` | ${postgres_password} |
| `PICSUR_ADMIN_PASSWORD` | ${admin_password} |
| `PICSUR_JWT_SECRET` | *generated JWT* |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `picsur` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  picsur:
    image: ghcr.io/caramelfur/picsur:latest
    restart: unless-stopped
    environment:
      PICSUR_DB_HOST: picsur_postgres
      PICSUR_DB_PORT: 5432
      PICSUR_DB_USERNAME: picsur
      PICSUR_DB_PASSWORD: ${POSTGRES_PASSWORD}
      PICSUR_DB_DATABASE: picsur
      PICSUR_ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      PICSUR_JWT_SECRET: ${JWT_SECRET}
    expose:
      - 8080

  picsur_postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: picsur
      POSTGRES_USER: picsur
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - picsur-data:/var/lib/postgresql/data

volumes:
  picsur-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
