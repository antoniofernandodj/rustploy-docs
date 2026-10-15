---
title: Host Botpress with Rustploy
description: "Platform for building and orchestrating conversational AI agents. Create Botpress in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Botpress**: Platform for building and orchestrating conversational AI agents. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `botpress` |
| **Containers** | 2 (`botpress`, `botpress-db`) |
| **Images** | `botpress/server:12.31.9`, `postgres:15-alpine` |
| **UI port** | 81, on service `botpress` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Botpress** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${db_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `botpress` | 81 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  botpress:
    image: botpress/server:12.31.9
    restart: unless-stopped
    ports:
      - 81
    environment:
      - BP_HOST=0.0.0.0
      - NODE_ENV=production
      - PG_HOST=botpress-db
      - PG_PORT=5432
      - PG_USER=postgres
      - PG_PASSWORD=${DB_PASSWORD}
      - PG_SSL=false
      - PORT=80
    volumes:
      - data:/botpress/data
    depends_on:
      - botpress-db

  botpress-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=botpress
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  data: {}
  db_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
