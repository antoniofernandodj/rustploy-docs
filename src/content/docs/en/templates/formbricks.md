---
title: Host Formbricks with Rustploy
description: "Modular tool for building and analyzing user surveys. Create Formbricks in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Formbricks**: Modular tool for building and analyzing user surveys. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `formbricks` |
| **Containers** | 2 (`postgres`, `formbricks`) |
| **Images** | `pgvector/pgvector:pg17`, `ghcr.io/formbricks/formbricks:v3.1.5` |
| **UI port** | 3000, on service `formbricks` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Formbricks** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_base` | *random base64 key (64 bytes)* |
| `encryption_key` | *random password, 32 characters* |
| `cron_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `WEBAPP_URL` | http://${main_domain} |
| `NEXTAUTH_URL` | http://${main_domain} |
| `NEXTAUTH_SECRET` | ${secret_base} |
| `ENCRYPTION_KEY` | ${encryption_key} |
| `CRON_SECRET` | ${cron_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `formbricks` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
x-environment: &environment
  environment:
    WEBAPP_URL: ${WEBAPP_URL}
    NEXTAUTH_URL: ${NEXTAUTH_URL}
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/formbricks?schema=public"
    NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    ENCRYPTION_KEY: ${ENCRYPTION_KEY}
    CRON_SECRET: ${CRON_SECRET}
    EMAIL_VERIFICATION_DISABLED: 1
    PASSWORD_RESET_DISABLED: 1
    S3_FORCE_PATH_STYLE: 0

services:
  postgres:
    restart: always
    image: pgvector/pgvector:pg17
    volumes:
      - postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres


  formbricks:
    restart: always
    image: ghcr.io/formbricks/formbricks:v3.1.5
    depends_on:
      - postgres
    ports:
      - 3000
    volumes:
      - ../files/uploads:/home/nextjs/apps/web/uploads/
    <<: *environment

volumes:
  postgres:
    driver: local
  uploads:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
