---
title: Host Strapi with Rustploy
description: "Market-leading JavaScript-based headless CMS for quickly building content APIs. Create Strapi in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Strapi**: Market-leading JavaScript-based headless CMS for quickly building content APIs. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `strapi` |
| **Containers** | 2 (`strapi`, `strapi_postgres`) |
| **Images** | `elestio/strapi-production:v5.33.0`, `postgres:18` |
| **UI port** | 1337, on service `strapi` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Strapi** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `jwt_secret` | *random password, 32 characters* |
| `admin_jwt_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `JWT_SECRET` | *generated JWT* |
| `ADMIN_JWT_SECRET` | ${admin_jwt_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `strapi` | 1337 | ${main_domain} |

## The template docker-compose.yml

```yaml
# Self-host guide:
# - https://strapi.io/blog/how-to-self-host-your-headless-cms-using-docker-compose

services:
  strapi:
    image: elestio/strapi-production:v5.33.0
    environment:
      # https://docs.strapi.io/cms/configurations/environment
      NODE_ENV: production
      STRAPI_TELEMETRY_DISABLED: true
      STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE: en
      FAST_REFRESH: true
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      DATABASE_CLIENT: postgres
      DATABASE_HOST: strapi_postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - strapi_data:/srv/app
    expose:
      - 1337
    depends_on:
      - strapi_postgres
    healthcheck:
      test:
        - CMD
        - wget
        - "-q"
        - "--spider"
        - "http://127.0.0.1:1337"
      start_period: 3s
      interval: 30s
      timeout: 10s
      retries: 5

  strapi_postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - strapi_postgres_data:/var/lib/postgresql
    healthcheck:
      test:
        - CMD-SHELL
        - "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"
      start_period: 3s
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  strapi_data:
  strapi_postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
