---
title: Host Vikunja with Rustploy
description: "Complete task and to-do list organizer with Kanban and Gantt views. Create Vikunja in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Vikunja**: Complete task and to-do list organizer with Kanban and Gantt views. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `vikunja` |
| **Containers** | 2 (`vikunja`, `db`) |
| **Images** | `vikunja/vikunja`, `postgres:17` |
| **UI port** | 3456, on service `vikunja` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Vikunja** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `jwt_secret` | *generated JWT* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `VIKUNJA_SERVICE_PUBLICURL` | https://${main_domain} |
| `VIKUNJA_DATABASE_HOST` | db |
| `VIKUNJA_DATABASE_PASSWORD` | ${db_password} |
| `VIKUNJA_DATABASE_TYPE` | postgres |
| `VIKUNJA_DATABASE_USER` | vikunja |
| `VIKUNJA_DATABASE_DATABASE` | vikunja |
| `VIKUNJA_SERVICE_JWTSECRET` | *generated JWT* |

## Domains

| Service | Port | Host |
|---|---|---|
| `vikunja` | 3456 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  vikunja:
    image: vikunja/vikunja
    user: "0:0"
    environment:
      VIKUNJA_SERVICE_PUBLICURL: ${VIKUNJA_SERVICE_PUBLICURL}
      VIKUNJA_PUBLIC_PORT: ${VIKUNJA_PUBLIC_PORT}
      VIKUNJA_DATABASE_HOST: ${VIKUNJA_DATABASE_HOST}
      VIKUNJA_DATABASE_PASSWORD: ${VIKUNJA_DATABASE_PASSWORD}
      VIKUNJA_DATABASE_TYPE: ${VIKUNJA_DATABASE_TYPE}
      VIKUNJA_DATABASE_USER: ${VIKUNJA_DATABASE_USER}
      VIKUNJA_DATABASE_DATABASE: ${VIKUNJA_DATABASE_DATABASE}
      VIKUNJA_SERVICE_JWTSECRET: ${VIKUNJA_SERVICE_JWTSECRET}
    ports:
      - 3456
    volumes:
      - vikunja-files:/app/vikunja/files
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: ${VIKUNJA_DATABASE_PASSWORD}
      POSTGRES_USER: ${VIKUNJA_DATABASE_USER}
      POSTGRES_DB: ${VIKUNJA_DATABASE_DATABASE}
    volumes:
      - vikunja-db:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-U", "${VIKUNJA_DATABASE_USER}",  "-d", "${VIKUNJA_DATABASE_DATABASE}"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  vikunja-files: {}
  vikunja-db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
