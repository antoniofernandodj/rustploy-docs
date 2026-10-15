---
title: Host Shlink with Rustploy
description: "Self-hosted corporate link shortener built to run under your own domains. Create Shlink in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Shlink**: Self-hosted corporate link shortener built to run under your own domains. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `shlink` |
| **Containers** | 2 (`shlink`, `shlink-web`) |
| **Images** | `shlinkio/shlink:stable`, `shlinkio/shlink-web-client` |
| **UI port** | 8080, on service `shlink-web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Shlink** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `initial_api_key` | *random password, 30 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `INITIAL_API_KEY` | ${initial_api_key} |
| `DEFAULT_DOMAIN` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `shlink-web` | 8080 | web-${main_domain} |
| `shlink` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  shlink:
    image: shlinkio/shlink:stable
    environment:
      - INITIAL_API_KEY=${INITIAL_API_KEY}
      - DEFAULT_DOMAIN=${DEFAULT_DOMAIN}
      # Note: you should also update SHLINK_SERVER_URL in the shlink-web service.
      - IS_HTTPS_ENABLED=false
    volumes:
      - shlink-data:/etc/shlink/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:8080/rest/v3/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  shlink-web:
    image: shlinkio/shlink-web-client
    environment:
      - SHLINK_SERVER_API_KEY=${INITIAL_API_KEY}
      # Note: if you've set IS_HTTPS_ENABLED=true, change http to https.
      - SHLINK_SERVER_URL=http://${DEFAULT_DOMAIN}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:8080"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  shlink-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
