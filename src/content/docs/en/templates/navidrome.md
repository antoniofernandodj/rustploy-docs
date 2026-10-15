---
title: Host Navidrome with Rustploy
description: "Lightweight audio streaming server compatible with the Subsonic protocol. Create Navidrome in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Navidrome**: Lightweight audio streaming server compatible with the Subsonic protocol. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `navidrome` |
| **Containers** | 1 (`navidrome`) |
| **Images** | `deluan/navidrome:latest` |
| **UI port** | 4533, on service `navidrome` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Navidrome** and select it.
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
| `navidrome` | 4533 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    restart: unless-stopped
    environment:
      - ND_SCANSCHEDULE=1h
      - ND_LOGLEVEL=info
      - ND_SESSIONTIMEOUT=24h
    volumes:
      - navidrome-data:/data
      - navidrome-music:/music:ro
    ports:
      - 4533

volumes:
  navidrome-data: {}
  navidrome-music: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
