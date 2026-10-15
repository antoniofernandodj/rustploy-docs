---
title: Host OpenGist with Rustploy
description: "Self-hosted alternative to GitHub Gist for public or private code snippet sharing. Create OpenGist in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**OpenGist**: Self-hosted alternative to GitHub Gist for public or private code snippet sharing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `opengist` |
| **Containers** | 1 (`opengist`) |
| **Images** | `ghcr.io/thomiceli/opengist:1` |
| **UI port** | 6157, on service `opengist` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **OpenGist** and select it.
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
| `UID` | 1001 |
| `GID` | 1001 |
| `OG_LOG_LEVEL` | info |

## Domains

| Service | Port | Host |
|---|---|---|
| `opengist` | 6157 | ${main_domain} |

## The template docker-compose.yml

```yaml
# docker-compose.yml
version: "3.8"
services:
  opengist:
    image: ghcr.io/thomiceli/opengist:1
    restart: unless-stopped
    ports:
      - 6157 # HTTP port
      - 2222 # SSH port (optional)
    volumes:
      - opengist-data:/opengist
    environment:
      - UID=${UID}
      - GID=${GID}
      - OG_LOG_LEVEL=${OG_LOG_LEVEL}
volumes:
  opengist-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
