---
title: Host Zipline with Rustploy
description: "Fast file upload server optimized for integration with tools such as ShareX. Create Zipline in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Zipline**: Fast file upload server optimized for integration with tools such as ShareX. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `zipline` |
| **Containers** | 2 (`postgres`, `zipline`) |
| **Images** | `postgres:15`, `ghcr.io/diced/zipline:v4` |
| **UI port** | 3000, on service `zipline` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Zipline** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_base` | *random base64 key (64 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ZIPLINE_PORT` | 3000 |
| `ZIPLINE_SECRET` | ${secret_base} |
| `ZIPLINE_RETURN_HTTPS` | false |
| `ZIPLINE_LOGGER` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `zipline` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:15
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DATABASE=postgres
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  zipline:
    image: ghcr.io/diced/zipline:v4
    restart: unless-stopped
    environment:
      - CORE_RETURN_HTTPS=${ZIPLINE_RETURN_HTTPS}
      - CORE_SECRET=${ZIPLINE_SECRET}
      - CORE_HOSTNAME=0.0.0.0
      - CORE_PORT=${ZIPLINE_PORT}
      - DATABASE_URL=postgres://postgres:postgres@postgres/postgres
      - CORE_LOGGER=${ZIPLINE_LOGGER}
      - DATASOURCE_TYPE=local
      - DATASOURCE_LOCAL_DIRECTORY=./uploads
    volumes:
      - "../files/uploads:/zipline/uploads"
      - "../files/public:/zipline/public"
    depends_on:
      - "postgres"

volumes:
  pg_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
