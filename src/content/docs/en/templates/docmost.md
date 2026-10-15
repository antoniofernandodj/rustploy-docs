---
title: Host Docmost with Rustploy
description: "Open-source collaborative wiki for team documentation. Create Docmost in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Docmost**: Open-source collaborative wiki for team documentation. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `docmost` |
| **Containers** | 3 (`docmost`, `db`, `redis`) |
| **Images** | `docmost/docmost:0.4.1`, `postgres:16-alpine`, `redis:7.2-alpine` |
| **UI port** | 3000, on service `docmost` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Docmost** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `app_secret` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_DB` | docmost |
| `POSTGRES_USER` | docmost |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `APP_URL` | http://${main_domain}:3000 |
| `APP_SECRET` | ${app_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `docmost` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  docmost:
    image: docmost/docmost:0.4.1
    depends_on:
      - db
      - redis
    environment:
      - APP_URL
      - APP_SECRET
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public
      - REDIS_URL=redis://redis:6379
    restart: unless-stopped

    volumes:
      - docmost:/app/data/storage

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB
      - POSTGRES_USER
      - POSTGRES_PASSWORD
    restart: unless-stopped

    volumes:
      - db_docmost_data:/var/lib/postgresql/data

  redis:
    image: redis:7.2-alpine
    restart: unless-stopped

    volumes:
      - redis_docmost_data:/data

volumes:
  docmost:
  db_docmost_data:
  redis_docmost_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
