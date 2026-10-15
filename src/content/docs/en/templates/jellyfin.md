---
title: Host Jellyfin with Rustploy
description: "Completely free, open-source media hub and video streaming. Create Jellyfin in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Jellyfin**: Completely free, open-source media hub and video streaming. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `jellyfin` |
| **Containers** | 1 (`jellyfin`) |
| **Images** | `jellyfin/jellyfin:10` |
| **UI port** | 8096, on service `jellyfin` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Jellyfin** and select it.
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
| `JELLYFIN_HOST` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `jellyfin` | 8096 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  jellyfin:
    image: jellyfin/jellyfin:10
    volumes:
      - config:/config
      - cache:/cache
      - media:/media
    restart: "unless-stopped"
    # Optional - alternative address used for autodiscovery
    environment:
      - JELLYFIN_PublishedServerUrl=http://${JELLYFIN_HOST}
    # Optional - may be necessary for docker healthcheck to pass if running in host network mode
    extra_hosts:
      - "host.docker.internal:host-gateway"
volumes:
  config:
  cache:
  media:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
