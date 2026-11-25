---
title: Host CookieCloud with Rustploy
description: "Encrypted browser cookie synchronizer across devices. Create CookieCloud in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**CookieCloud**: Encrypted browser cookie synchronizer across devices. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cookie-cloud` |
| **Containers** | 1 (`cookiecloud`) |
| **Images** | `easychen/cookiecloud:latest` |
| **UI port** | 8088, on service `cookiecloud` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **CookieCloud** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `cookiecloud` | 8088 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  cookiecloud:
    image: easychen/cookiecloud:latest
    restart: unless-stopped
    expose:
      - 8088
    volumes:
      - cookiecloud-data:/data/api/data
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8088"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  cookiecloud-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
