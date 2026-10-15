---
title: Host Activepieces with Rustploy
description: "No-code automation (alternative to Zapier and Make). Create Activepieces in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Activepieces**: No-code automation (alternative to Zapier and Make). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `activepieces` |
| **Containers** | 3 (`activepieces`, `postgres`, `redis`) |
| **Images** | `activepieces/activepieces:0.35.0`, `postgres:14`, `redis:7` |
| **UI port** | 80, on service `activepieces` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Activepieces** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_key` | *random password, 32 characters* |
| `encryption_key` | *random password, 32 characters* |
| `jwt_secret` | *random password, 32 characters* |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `AP_HOST` | ${main_domain} |
| `AP_API_KEY` | ${api_key} |
| `AP_ENCRYPTION_KEY` | ${encryption_key} |
| `AP_JWT_SECRET` | *generated JWT* |
| `AP_POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `activepieces` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  activepieces:
    image: activepieces/activepieces:0.35.0
    restart: unless-stopped

    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      AP_ENGINE_EXECUTABLE_PATH: dist/packages/engine/main.js
      AP_API_KEY: ${AP_API_KEY}
      AP_ENCRYPTION_KEY: ${AP_ENCRYPTION_KEY}
      AP_JWT_SECRET: ${AP_JWT_SECRET}
      AP_ENVIRONMENT: prod
      AP_FRONTEND_URL: https://${AP_HOST}
      AP_WEBHOOK_TIMEOUT_SECONDS: 30
      AP_TRIGGER_DEFAULT_POLL_INTERVAL: 5
      AP_POSTGRES_DATABASE: activepieces
      AP_POSTGRES_HOST: postgres
      AP_POSTGRES_PORT: 5432
      AP_POSTGRES_USERNAME: activepieces
      AP_POSTGRES_PASSWORD: ${AP_POSTGRES_PASSWORD}
      AP_EXECUTION_MODE: UNSANDBOXED
      AP_REDIS_HOST: redis
      AP_REDIS_PORT: 6379
      AP_SANDBOX_RUN_TIME_SECONDS: 600
      AP_TELEMETRY_ENABLED: "false"
      AP_TEMPLATES_SOURCE_URL: https://cloud.activepieces.com/api/v1/flow-templates

  postgres:
    image: postgres:14
    restart: unless-stopped

    environment:
      POSTGRES_DB: activepieces
      POSTGRES_PASSWORD: ${AP_POSTGRES_PASSWORD}
      POSTGRES_USER: activepieces
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U activepieces -d activepieces"]
      interval: 30s
      timeout: 30s
      retries: 3

  redis:
    image: redis:7
    restart: unless-stopped

    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 30s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
