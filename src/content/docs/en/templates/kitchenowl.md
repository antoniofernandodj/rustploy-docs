---
title: Host KitchenOwl with Rustploy
description: "Smart organizer for recipes and grocery lists. Create KitchenOwl in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**KitchenOwl**: Smart organizer for recipes and grocery lists. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kitchenowl` |
| **Containers** | 2 (`web`, `db`) |
| **Images** | `tombursch/kitchenowl:v0.7.1`, `postgres:17` |
| **UI port** | 8080, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **KitchenOwl** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `app_password` | *random password, 32 characters* |
| `db_password` | *random password, 24 characters* |
| `db_user` | kitchenowl |
| `db_name` | kitchenowl |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_SECRET_KEY` | ${app_password} |
| `DB_DRIVER` | postgresql |
| `DB_HOST` | db |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  web:
    image: tombursch/kitchenowl:v0.7.1
    restart: unless-stopped
    environment:
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - DB_DRIVER=postgresql
      - DB_HOST=db
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - kitchenowl_files:/data
    depends_on:
      - db

  db:
    image: postgres:17
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - kitchenowl_db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s
      timeout: 60s
      retries: 5
      start_period: 80s

volumes:
  kitchenowl_files: {}
  kitchenowl_db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
