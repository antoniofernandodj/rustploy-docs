---
title: Host Domain Locker with Rustploy
description: "Automatic monitor and tracker of web domain expiration. Create Domain Locker in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Domain Locker**: Automatic monitor and tracker of web domain expiration. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `domain-locker` |
| **Containers** | 3 (`postgres`, `app`, `updater`) |
| **Images** | `postgres:15-alpine`, `lissy93/domain-locker:latest`, `alpine:3.20` |
| **UI port** | 3000, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Domain Locker** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `pg_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NODE_ENV` | production |
| `DL_ENV_TYPE` | selfHosted |
| `DL_PG_HOST` | postgres |
| `DL_PG_PORT` | 5432 |
| `DL_PG_USER` | postgres |
| `DL_PG_PASSWORD` | ${pg_password} |
| `DL_PG_NAME` | domain_locker |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DL_PG_NAME:-domain_locker}
      POSTGRES_USER: ${DL_PG_USER:-postgres}
      POSTGRES_PASSWORD: ${DL_PG_PASSWORD:-changeme2420}
    expose:
      - "5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # - ./db/schema.sql:/docker-entrypoint-initdb.d/init-schema.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DL_PG_USER:-postgres}"]
      interval: 5s
      timeout: 3s
      retries: 10

  app:
    image: lissy93/domain-locker:latest
    restart: unless-stopped
    environment:
      NODE_ENV: "production"
      DL_ENV_TYPE: ${DL_ENV_TYPE:-selfHosted}
      DL_PG_HOST: ${DL_PG_HOST:-postgres}
      DL_PG_PORT: ${DL_PG_PORT:-5432}
      DL_PG_USER: ${DL_PG_USER:-postgres}
      DL_PG_PASSWORD: ${DL_PG_PASSWORD:-changeme2420}
      DL_PG_NAME: ${DL_PG_NAME:-domain_locker}
    expose:
      - "3000"
    depends_on:
      - postgres

  updater:
    image: alpine:3.20
    restart: unless-stopped
    depends_on:
      - app
    command: >
      /bin/sh -c "
        apk add --no-cache curl &&
        echo '0 3 * * * /usr/bin/curl -s -X POST http://app:3000/api/domain-updater' > /etc/crontabs/root &&
        echo '0 4 * * * /usr/bin/curl -s -X POST http://app:3000/api/expiration-reminders' >> /etc/crontabs/root &&
        crond -f -L /dev/stdout
      "

volumes:
  postgres_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
