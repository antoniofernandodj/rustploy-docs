---
title: Host Slash with Rustploy
description: "Fast internal shortener for organizing favorite link paths. Create Slash in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Slash**: Fast internal shortener for organizing favorite link paths. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `slash` |
| **Containers** | 2 (`slash-app`, `slash-postgres`) |
| **Images** | `yourselfhosted/slash:latest`, `postgres:16-alpine` |
| **UI port** | 5231, on service `slash-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Slash** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `db_user` | slash |
| `db_name` | slash |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_NAME` | ${db_name} |

## Domains

| Service | Port | Host |
|---|---|---|
| `slash-app` | 5231 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  slash-app:
    image: yourselfhosted/slash:latest

    volumes:
      - slash-app-data:/var/opt/slash
    environment:
      - SLASH_DRIVER=postgres
      - SLASH_DSN=postgresql://${DB_USER}:${DB_PASSWORD}@slash-postgres:5432/${DB_NAME}?sslmode=disable
    depends_on:
      slash-postgres:
        condition: service_healthy
    restart: unless-stopped

  slash-postgres:
    image: postgres:16-alpine

    volumes:
      - slash-postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  slash-app-data:
  slash-postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
