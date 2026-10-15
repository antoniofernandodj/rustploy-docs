---
title: Host Hoppscotch with Rustploy
description: "Hoppscotch application. Create Hoppscotch in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Hoppscotch**: Hoppscotch application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `hoppscotch` |
| **Containers** | 3 (`hoppscotch`, `postgres`, `migrate`) |
| **Images** | `hoppscotch/hoppscotch:latest`, `postgres:16` |
| **UI port** | 80, on service `hoppscotch` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Hoppscotch** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `encryption_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_DB` | hoppscotch |
| `POSTGRES_USER` | hoppscotch |
| `POSTGRES_PASSWORD` | ${db_password} |
| `DATABASE_URL` | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB} |
| `DATA_ENCRYPTION_KEY` | ${encryption_key} |
| `HOPP_AIO_ALTERNATE_PORT` | 80 |
| `WHITELISTED_ORIGINS` | https://${main_domain},http://${main_domain},app://hoppscotch |
| `VITE_BASE_URL` | https://${main_domain} |
| `VITE_SHORTCODE_BASE_URL` | https://${main_domain} |
| `VITE_ADMIN_URL` | https://${main_domain}/admin |
| `VITE_BACKEND_GQL_URL` | https://${main_domain}/backend/graphql |
| `VITE_BACKEND_WS_URL` | wss://${main_domain}/backend/graphql |
| `VITE_BACKEND_API_URL` | https://${main_domain}/backend/v1 |
| `VITE_APP_TOS_LINK` | https://docs.hoppscotch.io/support/terms |
| `VITE_APP_PRIVACY_POLICY_LINK` | https://docs.hoppscotch.io/support/privacy |
| `ENABLE_SUBPATH_BASED_ACCESS` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `hoppscotch` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  hoppscotch:
    image: hoppscotch/hoppscotch:latest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    expose:
      - 80
    environment:
      # Database
      DATABASE_URL: "${DATABASE_URL}"
      DATA_ENCRYPTION_KEY: "${DATA_ENCRYPTION_KEY}"
      HOPP_AIO_ALTERNATE_PORT: "${HOPP_AIO_ALTERNATE_PORT}"
      WHITELISTED_ORIGINS: "${WHITELISTED_ORIGINS}"

      # Frontend config
      VITE_BASE_URL: "${VITE_BASE_URL}"
      VITE_SHORTCODE_BASE_URL: "${VITE_SHORTCODE_BASE_URL}"
      VITE_ADMIN_URL: "${VITE_ADMIN_URL}"

      # Backend config
      VITE_BACKEND_GQL_URL: "${VITE_BACKEND_GQL_URL}"
      VITE_BACKEND_WS_URL: "${VITE_BACKEND_WS_URL}"
      VITE_BACKEND_API_URL: "${VITE_BACKEND_API_URL}"

      # Optional UI links
      VITE_APP_TOS_LINK: "${VITE_APP_TOS_LINK}"
      VITE_APP_PRIVACY_POLICY_LINK: "${VITE_APP_PRIVACY_POLICY_LINK}"

      # Subpath access
      ENABLE_SUBPATH_BASED_ACCESS: "true"

    volumes:
      - hoppscotch-data:/app/data

  postgres:
    image: postgres:16
    restart: unless-stopped
    expose:
      - 5432
    environment:
      POSTGRES_DB: "${POSTGRES_DB}"
      POSTGRES_USER: "${POSTGRES_USER}"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
    volumes:
      - hoppscotch-postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  migrate:
    image: hoppscotch/hoppscotch:latest
    depends_on:
      postgres:
        condition: service_healthy
    entrypoint: ["/bin/sh", "-c"]
    command:
      - |
        echo "Running database migrations..."
        pnpm dlx prisma migrate deploy && echo "Migration complete!"
    environment:
      DATABASE_URL: "${DATABASE_URL}"
    restart: "no"

volumes:
  hoppscotch-data:
  hoppscotch-postgres:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
