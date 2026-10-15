---
title: Host Browserless with Rustploy
description: "Remote, headless Chrome/Puppeteer execution in Docker containers. Create Browserless in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Browserless**: Remote, headless Chrome/Puppeteer execution in Docker containers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `browserless` |
| **Containers** | 1 (`browserless`) |
| **Images** | `ghcr.io/browserless/chromium:latest` |
| **UI port** | 3000, on service `browserless` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Browserless** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `browserless_token` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BROWSERLESS_HOST` | ${main_domain} |
| `BROWSERLESS_TOKEN` | ${browserless_token} |

## Domains

| Service | Port | Host |
|---|---|---|
| `browserless` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  browserless:
    image: ghcr.io/browserless/chromium:latest
    environment:
      TOKEN: ${BROWSERLESS_TOKEN}
    expose:
      - 3000
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://127.0.0.1:3000/docs'
      interval: 2s
      timeout: 10s
      retries: 15
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
