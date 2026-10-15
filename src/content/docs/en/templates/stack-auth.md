---
title: Host Stack Auth with Rustploy
description: "Simplified user authentication provider (open alternative to Clerk/Auth0). Create Stack Auth in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Stack Auth**: Simplified user authentication provider (open alternative to Clerk/Auth0). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `stack-auth` |
| **Containers** | 2 (`stack-auth-db`, `stack-auth`) |
| **Images** | `postgres:17`, `stackauth/server:latest` |
| **UI port** | 8102, on service `stack-auth` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Stack Auth** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `dashboard_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `stack_auth_api_url` | ${api_domain} |
| `stack_auth_dashboard_url` | ${dashboard_domain} |
| `stack_auth_postgres_host` | stack-auth-db |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_USER` | postgres |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | stackframe |
| `NEXT_PUBLIC_STACK_API_URL` | http://${stack_auth_api_url} |
| `NEXT_PUBLIC_STACK_DASHBOARD_URL` | http://${stack_auth_dashboard_url} |
| `STACK_DATABASE_CONNECTION_STRING` | postgres://postgres:${postgres_password}@${stack_auth_postgres_host}/stackframe |
| `STACK_DIRECT_DATABASE_CONNECTION_STRING` | postgres://postgres:${postgres_password}@${stack_auth_postgres_host}/stackframe |
| `STACK_SERVER_SECRET` | *random password, 64 characters* |
| `STACK_SEED_INTERNAL_PROJECT_ALLOW_LOCALHOST` | true |
| `STACK_SEED_INTERNAL_PROJECT_SIGN_UP_ENABLED` | true |
| `STACK_RUN_MIGRATIONS` | true |
| `STACK_RUN_SEED_SCRIPT` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `stack-auth` | 8102 | ${stack_auth_api_url} |
| `stack-auth` | 8101 | ${stack_auth_dashboard_url} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  stack-auth-db:
    image: postgres:17
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - stack-auth-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-d", "db_prod"]
      interval: 10s
      timeout: 60s
      retries: 5
      start_period: 80s
      
  stack-auth:
    image: stackauth/server:latest
    container_name: stack-auth
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
      - NEXT_PUBLIC_STACK_API_URL=${NEXT_PUBLIC_STACK_API_URL}
      - NEXT_PUBLIC_STACK_DASHBOARD_URL=${NEXT_PUBLIC_STACK_DASHBOARD_URL}
      - STACK_DATABASE_CONNECTION_STRING=${STACK_DATABASE_CONNECTION_STRING}
      - STACK_DIRECT_DATABASE_CONNECTION_STRING=${STACK_DIRECT_DATABASE_CONNECTION_STRING}
      - STACK_SERVER_SECRET=${STACK_SERVER_SECRET}
      - STACK_SEED_INTERNAL_PROJECT_ALLOW_LOCALHOST=${STACK_SEED_INTERNAL_PROJECT_ALLOW_LOCALHOST}
      - STACK_SEED_INTERNAL_PROJECT_SIGN_UP_ENABLED=${STACK_SEED_INTERNAL_PROJECT_SIGN_UP_ENABLED}
      - STACK_RUN_MIGRATIONS=${STACK_RUN_MIGRATIONS}
      - STACK_RUN_SEED_SCRIPT=${STACK_RUN_SEED_SCRIPT}
      - STACK_EMAIL_HOST=${STACK_EMAIL_HOST}
    depends_on:
      stack-auth-db:
        condition: service_healthy

    
volumes:
  stack-auth-db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
