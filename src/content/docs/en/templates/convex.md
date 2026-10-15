---
title: Host Convex with Rustploy
description: "Reactive database that simplifies building real-time web applications. Create Convex in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Convex**: Reactive database that simplifies building real-time web applications. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `convex` |
| **Containers** | 2 (`backend`, `dashboard`) |
| **Images** | `ghcr.io/get-convex/convex-backend:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f`, `ghcr.io/get-convex/convex-dashboard:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f` |
| **UI port** | 6791, on service `dashboard` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Convex** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `dashboard_domain` | *domain (generated; replace it with yours)* |
| `backend_domain` | *domain (generated; replace it with yours)* |
| `actions_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_DEPLOYMENT_URL` | http://${backend_domain} |
| `CONVEX_CLOUD_ORIGIN` | http://${backend_domain} |
| `CONVEX_SITE_ORIGIN` | http://${actions_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `dashboard` | 6791 | ${dashboard_domain} |
| `backend` | 3210 | ${backend_domain} |
| `backend` | 3211 | ${actions_domain} |

## The template docker-compose.yml

```yaml
services:
  backend:
    image: ghcr.io/get-convex/convex-backend:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f
    expose:
      - "3210"
      - "3211"
    volumes:
      - data:/convex/data
    environment:
      - INSTANCE_NAME=${INSTANCE_NAME:-}
      - INSTANCE_SECRET=${INSTANCE_SECRET:-}
      - CONVEX_RELEASE_VERSION_DEV=${CONVEX_RELEASE_VERSION_DEV:-}
      - ACTIONS_USER_TIMEOUT_SECS=${ACTIONS_USER_TIMEOUT_SECS:-}
      - CONVEX_CLOUD_ORIGIN=${CONVEX_CLOUD_ORIGIN:-http://127.0.0.1:3210}
      - CONVEX_SITE_ORIGIN=${CONVEX_SITE_ORIGIN:-http://127.0.0.1:3211}
      - DATABASE_URL=${DATABASE_URL:-}
      - DISABLE_BEACON=${DISABLE_BEACON:-FALSE}
      - REDACT_LOGS_TO_CLIENT=${REDACT_LOGS_TO_CLIENT:-}
      - RUST_LOG=${RUST_LOG:-info}
      - RUST_BACKTRACE=${RUST_BACKTRACE:-}
    healthcheck:
      test: curl -f http://localhost:3210/version
      interval: 5s
      start_period: 5s

  dashboard:
    image: ghcr.io/get-convex/convex-dashboard:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f
    expose:
      - "6791"
    environment:
      - NEXT_PUBLIC_DEPLOYMENT_URL=${NEXT_PUBLIC_DEPLOYMENT_URL:-http://127.0.0.1:3210}
    depends_on:
      backend:
        condition: service_healthy

volumes:
  data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
