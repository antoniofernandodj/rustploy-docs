---
title: Host Zitadel with Rustploy
description: "Next-generation identity and access management provider with native multi-tenancy support. Create Zitadel in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Zitadel**: Next-generation identity and access management provider with native multi-tenancy support. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `zitadel` |
| **Containers** | 2 (`zitadel`, `db`) |
| **Images** | `ghcr.io/zitadel/zitadel:latest`, `postgres:17-alpine` |
| **UI port** | 8080, on service `zitadel` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Zitadel** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `zitadel_masterkey` | *random password, 32 characters* |
| `admin_username` | *generated username* |
| `admin_email` | *generated email* |
| `admin_password` | AdminPassword123! |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ZITADEL_MASTERKEY` | ${zitadel_masterkey} |
| `EXTERNAL_DOMAIN` | ${main_domain} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME` | ${admin_username} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD` | ${admin_password} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS` | ${admin_email} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME` | Admin |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME` | User |

## Domains

| Service | Port | Host |
|---|---|---|
| `zitadel` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  zitadel:
    restart: 'always'
    image: 'ghcr.io/zitadel/zitadel:latest'
    command: 'start-from-init --masterkey "${ZITADEL_MASTERKEY}" --tlsMode disabled'
    environment:
      # Database Configuration
      ZITADEL_DATABASE_POSTGRES_HOST: db
      ZITADEL_DATABASE_POSTGRES_PORT: 5432
      ZITADEL_DATABASE_POSTGRES_DATABASE: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_USERNAME: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_PASSWORD: "${POSTGRES_PASSWORD}"
      ZITADEL_DATABASE_POSTGRES_USER_SSL_MODE: disable
      ZITADEL_DATABASE_POSTGRES_ADMIN_USERNAME: postgres
      ZITADEL_DATABASE_POSTGRES_ADMIN_PASSWORD: "${POSTGRES_PASSWORD}"
      ZITADEL_DATABASE_POSTGRES_ADMIN_SSL_MODE: disable

      # External Configuration for HTTP only - TLS mode disabled
      ZITADEL_EXTERNALSECURE: false
      ZITADEL_EXTERNALPORT: 8080
      ZITADEL_EXTERNALDOMAIN: "${EXTERNAL_DOMAIN}"
      ZITADEL_TLS_ENABLED: false

      # Disable Email Notifications
      ZITADEL_NOTIFICATIONS_SMTP_HOST: ""
      ZITADEL_NOTIFICATIONS_SMTP_PORT: ""

      # Custom Admin User Configuration
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME}"
      
      # Default Instance Features
      ZITADEL_DEFAULTINSTANCE_FEATURES_LOGINV2_REQUIRED: false

    depends_on:
      db:
        condition: 'service_healthy'
    ports:
      - '8080'
    volumes:
      - zitadel_data:/app/data

  db:
    restart: 'always'
    image: postgres:17-alpine
    environment:
      PGUSER: postgres
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
      POSTGRES_DB: zitadel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-d", "zitadel", "-U", "postgres"]
      interval: '10s'
      timeout: '30s'
      retries: 5
      start_period: '20s'

volumes:
  postgres_data:
  zitadel_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
