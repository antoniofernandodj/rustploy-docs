---
title: Host PocketBase with Rustploy
description: "Single-file embedded backend with SQLite, authentication, realtime and a dashboard. Create PocketBase in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**PocketBase**: Single-file embedded backend with SQLite, authentication, realtime and a dashboard. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pocketbase` |
| **Containers** | 1 (`pocketbase`) |
| **Images** | `adrianmusante/pocketbase:latest` |
| **UI port** | 8090, on service `pocketbase` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **PocketBase** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_email` | *generated email* |
| `admin_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `pocketbase` | 8090 | ${main_domain} |

## The template docker-compose.yml

```yaml
# IMPORTANT: Please update the admin credentials in your .env file
# Access PocketBase Admin UI at: https://your-domain.com/_/ (replace with your configured domain)
# Note: Admin UI may take up to 1 minute to load on first startup

version: "3.8"

services:
  pocketbase:
    image: adrianmusante/pocketbase:latest
    restart: always
    expose:
      - 8090
    volumes:
      - pocketbase-data:/pocketbase
    environment:
      - POCKETBASE_ADMIN_EMAIL=${ADMIN_EMAIL}
      - POCKETBASE_ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - POCKETBASE_ADMIN_UPSERT=true
      - POCKETBASE_PORT_NUMBER=8090
      # Optional: Encryption key for securing app settings (OAuth2 secrets, SMTP passwords, etc.)
      # Uncomment and set a secure key in your .env file for production use
      # - POCKETBASE_ENCRYPTION_KEY=${ENCRYPTION_KEY}
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8090/_/"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  pocketbase-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
