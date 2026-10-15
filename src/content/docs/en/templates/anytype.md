---
title: Host Anytype with Rustploy
description: "Offline-first, encrypted personal knowledge base. Create Anytype in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Anytype**: Offline-first, encrypted personal knowledge base. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `anytype` |
| **Containers** | 1 (`any-sync-bundle`) |
| **Images** | `ghcr.io/grishy/any-sync-bundle:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Anytype** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## The template docker-compose.yml

```yaml
# Example: Any-Sync-Bundle with embedded MongoDB and Redis (all-in-one image)
#
# Usage:
#   docker compose -f compose.aio.yml up -d
#
# The bundle image already contains MongoDB and Redis. Only the bundle service is required

services:
  any-sync-bundle:
    image: ghcr.io/grishy/any-sync-bundle:latest
    restart: unless-stopped
    ports:
      - "33010:33010"
      - "33020:33020/udp"
    volumes:
      - ./data:/data
    environment:
      # Advertise addresses clients should use. Replace with your server hostname/IP.
      ANY_SYNC_BUNDLE_INIT_EXTERNAL_ADDRS: "192.168.100.9"
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
