---
title: Host Apprise API with Rustploy
description: "Universal API for sending notifications to dozens of services. Create Apprise API in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Apprise API**: Universal API for sending notifications to dozens of services. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `apprise-api` |
| **Containers** | 1 (`apprise-api`) |
| **Images** | `linuxserver/apprise-api:latest` |
| **UI port** | 8000, on service `apprise-api` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Apprise API** and select it.
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
| `apprise-api` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  apprise-api:
    image: linuxserver/apprise-api:latest
    restart: unless-stopped
    ports:
      - 8000
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
    volumes:
      - config:/config

volumes:
  config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
