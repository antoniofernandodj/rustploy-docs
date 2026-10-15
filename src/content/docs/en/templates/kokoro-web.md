---
title: Host Kokoro Web with Rustploy
description: "User-friendly interface for generating audio with Kokoro AI. Create Kokoro Web in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Kokoro Web**: User-friendly interface for generating audio with Kokoro AI. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kokoro-web` |
| **Containers** | 1 (`kokoro-web`) |
| **Images** | `ghcr.io/eduardolat/kokoro-web:latest` |
| **UI port** | 3000, on service `kokoro-web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Kokoro Web** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_key` | *random password, 32 characters* |
| `no_track` | false |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `KW_SECRET_API_KEY` | ${api_key} |
| `KW_PUBLIC_NO_TRACK` | ${no_track} |

## Domains

| Service | Port | Host |
|---|---|---|
| `kokoro-web` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  kokoro-web:
    image: ghcr.io/eduardolat/kokoro-web:latest
    restart: unless-stopped
    environment:
      - KW_SECRET_API_KEY=${KW_SECRET_API_KEY}
      - KW_PUBLIC_NO_TRACK=${KW_PUBLIC_NO_TRACK}
    volumes:
      - kokoro-cache:/kokoro/cache

volumes:
  kokoro-cache: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
