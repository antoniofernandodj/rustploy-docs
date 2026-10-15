---
title: Host Coder with Rustploy
description: "Enterprise cloud development environment (CDE). Create Coder in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Coder**: Enterprise cloud development environment (CDE). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `coder` |
| **Containers** | 2 (`coder`, `db`) |
| **Images** | `ghcr.io/coder/coder:v2.15.3`, `postgres:17` |
| **UI port** | 7080, on service `coder` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Coder** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CODER_ACCESS_URL` |  |
| `CODER_HTTP_ADDRESS` | 0.0.0.0:7080 |
| `POSTGRES_DB` | coder |
| `POSTGRES_USER` | coder |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `coder` | 7080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  coder:
    image: ghcr.io/coder/coder:v2.15.3

    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    group_add:
      - "988"
    depends_on:
      db:
        condition: service_healthy
    environment:
      - CODER_ACCESS_URL
      - CODER_HTTP_ADDRESS
      - CODER_PG_CONNECTION_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}?sslmode=disable

  db:
    image: postgres:17

    environment:
      - POSTGRES_PASSWORD
      - POSTGRES_USER
      - POSTGRES_DB
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}",
        ]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - db_coder_data:/var/lib/postgresql/data

volumes:
  db_coder_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
