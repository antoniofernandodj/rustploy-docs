---
title: Host Plunk with Rustploy
description: "Integrated platform for managing transactional and marketing email sends. Create Plunk in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Plunk**: Integrated platform for managing transactional and marketing email sends. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `plunk` |
| **Containers** | 3 (`plunk`, `db`, `redis`) |
| **Images** | `driaug/plunk`, `postgres:alpine`, `redis:alpine` |
| **UI port** | 3000, on service `plunk` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Plunk** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_user` | plunk |
| `postgres_db` | plunk |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_PASSWORD` | *random password, 32 characters* |
| `REDIS_URL` | redis://redis:6379 |
| `JWT_SECRET` | *random password, 64 characters* |
| `APP_URI` | https://${main_domain} |
| `AWS_REGION` | <your-aws-region> |
| `AWS_ACCESS_KEY_ID` | <your-aws-access-key-id> |
| `AWS_SECRET_ACCESS_KEY` | <your-aws-secret-access-key> |
| `AWS_SES_CONFIGURATION_SET` | <your-ses-configuration-set> |
| `DISABLE_SIGNUPS` | False |

## Domains

| Service | Port | Host |
|---|---|---|
| `plunk` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
# IMPORTANT: Plunk requires HTTPS to work properly
# go to the "Domains" tab and enable HTTPS for your domain

services:
  plunk:
    image: driaug/plunk
    expose:
      - "3000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      REDIS_URL: ${REDIS_URL}
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_SES_CONFIGURATION_SET: ${AWS_SES_CONFIGURATION_SET}
      APP_URI: ${APP_URI}
      NEXT_PUBLIC_API_URI: ${APP_URI}/api
      API_URI: ${APP_URI}/api
      DISABLE_SIGNUPS: ${DISABLE_SIGNUPS}
    entrypoint: ["/app/entry.sh"]
    restart: unless-stopped

  db:
    image: postgres:alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      retries: 5
      timeout: 10s
    restart: unless-stopped
    expose:
      - 5432

  redis:
    image: redis:alpine
    restart: unless-stopped
    expose:
      - 6379
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
