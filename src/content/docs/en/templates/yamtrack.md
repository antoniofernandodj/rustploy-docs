---
title: Host Yamtrack with Rustploy
description: "Personal manager for watched anime and manga, built on a Redis database. Create Yamtrack in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Yamtrack**: Personal manager for watched anime and manga, built on a Redis database. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `yamtrack` |
| **Containers** | 2 (`yamtrack`, `redis`) |
| **Images** | `ghcr.io/fuzzygrim/yamtrack`, `redis:7-alpine` |
| **UI port** | 8000, on service `yamtrack` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Yamtrack** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `SECRET` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SECRET` | ${SECRET} |
| `TZ` | Europe/Berlin |
| `REDIS_URL` | redis://redis:6379 |

## Domains

| Service | Port | Host |
|---|---|---|
| `yamtrack` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  yamtrack:
    image: ghcr.io/fuzzygrim/yamtrack
    restart: unless-stopped
    depends_on:
      - redis
    environment:
      - TZ=Europe/Berlin
      - SECRET=${SECRET}
      - REDIS_URL=redis://redis:6379
    volumes:
      - yamtrack-db:/yamtrack/db
    expose:
      - 8000

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  yamtrack-db: {}
  redis_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
