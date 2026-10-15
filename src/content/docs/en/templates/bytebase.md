---
title: Host Bytebase with Rustploy
description: "Tool for controlling and managing the database lifecycle. Create Bytebase in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Bytebase**: Tool for controlling and managing the database lifecycle. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bytebase` |
| **Containers** | 2 (`bytebase`, `bytebase-db`) |
| **Images** | `bytebase/bytebase:3.3.0`, `postgres:13` |
| **UI port** | 8080, on service `bytebase` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Bytebase** and select it.
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
| `bytebase` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  bytebase:
    image: bytebase/bytebase:3.3.0
    restart: unless-stopped
    ports:
      - 8080
    environment:
      - PG_URL=postgres://postgres:${DB_PASSWORD}@bytebase-db:5432/bytebase
    volumes:
      - data:/var/opt/bytebase
    depends_on:
      - bytebase-db

  bytebase-db:
    image: postgres:13
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=bytebase
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
