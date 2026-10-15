---
title: Host Logto with Rustploy
description: "Modern CIAM platform for customer and workforce authentication. Create Logto in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Logto**: Modern CIAM platform for customer and workforce authentication. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `logto` |
| **Containers** | 2 (`app`, `postgres`) |
| **Images** | `ghcr.io/logto-io/logto:1.27.0`, `postgres:17-alpine` |
| **UI port** | 3001, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Logto** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LOGTO_ENDPOINT` | http://${admin_domain} |
| `LOGTO_ADMIN_ENDPOINT` | http://${admin_domain} |
| `LOGTO_POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 3001 | ${main_domain} |
| `app` | 3002 | ${admin_domain} |

## The template docker-compose.yml

```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy
    image: ghcr.io/logto-io/logto:1.27.0
    entrypoint: ["sh", "-c", "npm run cli db seed -- --swe && npm start"]
    ports:
      - 3001
      - 3002

    environment:
      TRUST_PROXY_HEADER: 1
      DB_URL: postgres://logto:${LOGTO_POSTGRES_PASSWORD}@postgres:5432/logto
      ENDPOINT: ${LOGTO_ENDPOINT}
      ADMIN_ENDPOINT: ${LOGTO_ADMIN_ENDPOINT}
    volumes:
      - logto-connectors:/etc/logto/packages/core/connectors
  postgres:
    image: postgres:17-alpine
    user: postgres

    environment:
      POSTGRES_USER: logto
      POSTGRES_PASSWORD: ${LOGTO_POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5


volumes:
  logto-connectors:
  postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
