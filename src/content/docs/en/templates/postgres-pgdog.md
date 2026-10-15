---
title: Host Postgres Pgdog with Rustploy
description: "Postgres Pgdog application. Create Postgres Pgdog in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Postgres Pgdog**: Postgres Pgdog application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `postgres-pgdog` |
| **Containers** | 2 (`postgres-pgdog`, `postgres`) |
| **Images** | `${PGDOG_IMAGE}`, `${POSTGRES_IMAGE}` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Postgres Pgdog** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `postgres_user` | *generated username* |
| `postgres_password` | *random password, 32 characters* |
| `postgres_db` | postgres |
| `pgdog_image` | ghcr.io/pgdogdev/pgdog:v0.1.26 |
| `postgres_image` | postgres:18-alpine |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |
| `PGDOG_IMAGE` | ${pgdog_image} |
| `POSTGRES_IMAGE` | ${postgres_image} |
| `RUST_LOG` | info |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `pgdog.toml`
- `users.toml`

## The template docker-compose.yml

```yaml
services:
  postgres-pgdog:
    image: ${PGDOG_IMAGE}
    restart: unless-stopped
    # Uncomment 'ports' settings below to enable external access
    # ports:
    #   - "6432:6432"
    volumes:
      - ../files/pgdog.toml:/pgdog/pgdog.toml
      - ../files/users.toml:/pgdog/users.toml
    environment:
      - RUST_LOG=${RUST_LOG}
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: ${POSTGRES_IMAGE}
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres-data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
