---
title: Host Pocket ID with Rustploy
description: "Simple OIDC authenticator that protects services using native passkeys. Create Pocket ID in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Pocket ID**: Simple OIDC authenticator that protects services using native passkeys. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pocket-id` |
| **Containers** | 1 (`pocket-id`) |
| **Images** | `ghcr.io/pocket-id/pocket-id:v1` |
| **UI port** | 1411, on service `pocket-id` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Pocket ID** and select it.
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
| `ENCRYPTION_KEY` | CHANGEME: openssl rand -base64 32 |
| `APP_URL` | http://${main_domain} |
| `TRUST_PROXY` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `pocket-id` | 1411 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  pocket-id:
    image: ghcr.io/pocket-id/pocket-id:v1
    restart: unless-stopped
    environment:
      - APP_URL
      - TRUST_PROXY
      - ENCRYPTION_KEY
    volumes:
      - pocket-id-data:/app/data
    healthcheck:
      test: [ "CMD", "/app/pocket-id", "healthcheck" ]
      interval: 1m30s
      timeout: 5s
      retries: 2
      start_period: 10s

volumes:
  pocket-id-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
