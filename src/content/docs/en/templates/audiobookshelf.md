---
title: Host Audiobookshelf with Rustploy
description: "Media server dedicated to audiobooks and podcasts. Create Audiobookshelf in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Audiobookshelf**: Media server dedicated to audiobooks and podcasts. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `audiobookshelf` |
| **Containers** | 1 (`audiobookshelf`) |
| **Images** | `ghcr.io/advplyr/audiobookshelf:2.19.4` |
| **UI port** | 80, on service `audiobookshelf` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Audiobookshelf** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `audiobooks_path` | /path/to/your/audiobooks |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `AUDIOBOOKS_PATH` | ${audiobooks_path} |

## Domains

| Service | Port | Host |
|---|---|---|
| `audiobookshelf` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:2.19.4
    restart: unless-stopped
    ports:
      - 80
    environment:
      - TZ=UTC
    volumes:
      - config:/config
      - metadata:/metadata
      - ${AUDIOBOOKS_PATH}:/audiobooks

volumes:
  config: {}
  metadata: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
