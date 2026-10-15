---
title: Host Umami with Rustploy
description: "The classic, popular privacy-focused web analytics, a clean alternative to Google Analytics. Create Umami in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Umami**: The classic, popular privacy-focused web analytics, a clean alternative to Google Analytics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `umami` |
| **Containers** | 2 (`umami`, `db`) |
| **Images** | `ghcr.io/umami-software/umami:3.0.3`, `postgres:15-alpine` |
| **UI port** | 3000, on service `umami` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Umami** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_SECRET` | *random base64 key (64 bytes)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `umami` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:3.0.3
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "curl http://localhost:3000/api/heartbeat"]
      interval: 5s
      timeout: 5s
      retries: 5
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://umami:umami@db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: ${APP_SECRET}
  db:
    image: postgres:15-alpine
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: umami

volumes:
  db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
