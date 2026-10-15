---
title: Host NocoDB with Rustploy
description: "Turns any relational database (Postgres/MySQL) into a smart Airtable-style interface. Create NocoDB in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**NocoDB**: Turns any relational database (Postgres/MySQL) into a smart Airtable-style interface. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `nocodb` |
| **Containers** | 2 (`nocodb`, `root_db`) |
| **Images** | `nocodb/nocodb:latest`, `postgres:16.6` |
| **UI port** | 8080, on service `nocodb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **NocoDB** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_user` | postgres |
| `postgres_password` | *random password, 32 characters* |
| `postgres_db` | root_db |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |

## Domains

| Service | Port | Host |
|---|---|---|
| `nocodb` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  nocodb:
    image: nocodb/nocodb:latest
    restart: always
    depends_on:
      root_db:
        condition: service_healthy
    environment:
      # Reuses DB env from template.toml / .env
      NC_DB: "pg://root_db:5432?u=${POSTGRES_USER}&p=${POSTGRES_PASSWORD}&d=${POSTGRES_DB}"
    volumes:
      - nc_data:/usr/app/data

  root_db:
    image: postgres:16.6
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    # More reliable healthcheck:
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'pg_isready -h 127.0.0.1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"',
        ]
      interval: 10s
      timeout: 5s
      start_period: 20s
      retries: 10
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data: {}
  nc_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
