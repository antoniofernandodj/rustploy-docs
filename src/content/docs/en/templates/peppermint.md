---
title: Host Peppermint with Rustploy
description: "Unified environment for documentation, design and quick API endpoint testing. Create Peppermint in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Peppermint**: Unified environment for documentation, design and quick API endpoint testing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `peppermint` |
| **Containers** | 2 (`peppermint-postgres`, `peppermint-app`) |
| **Images** | `postgres:latest`, `pepperlabs/peppermint:latest` |
| **UI port** | 3000, on service `peppermint-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Peppermint** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MAIN_DOMAIN` | ${main_domain} |
| `API_DOMAIN` | ${api_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `SECRET` | ${secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `peppermint-app` | 3000 | ${main_domain} |
| `peppermint-app` | 5003 | ${api_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  peppermint-postgres:
    image: postgres:latest
    restart: always

    volumes:
      - peppermint-postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: peppermint
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: peppermint
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U peppermint"]
      interval: 10s
      timeout: 5s
      retries: 5

  peppermint-app:
    image: pepperlabs/peppermint:latest
    restart: always

    depends_on:
      peppermint-postgres:
        condition: service_healthy
    environment:
      DB_USERNAME: "peppermint"
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      DB_HOST: "peppermint-postgres"
      SECRET: ${SECRET}

volumes:
  peppermint-postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
