---
title: Host qBittorrent with Rustploy
description: "Classic BitTorrent client with its native web management interface. Create qBittorrent in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**qBittorrent**: Classic BitTorrent client with its native web management interface. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `qbittorrent` |
| **Containers** | 1 (`qbittorrent`) |
| **Images** | `lscr.io/linuxserver/qbittorrent:latest` |
| **UI port** | 8080, on service `qbittorrent` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **qBittorrent** and select it.
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
| `qbittorrent` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
# docker-compose.yml
# 
# IMPORTANT: First-time setup information
# - Default username: admin
# - Password: Check container logs for temporary password on first startup
# - Access via your configured domain (HTTPS) after deployment
# - Change the default password immediately after first login
#
services:
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - WEBUI_PORT=8080
      - TORRENTING_PORT=6881
    volumes:
      - qb_config:/config
      - qb_downloads:/downloads
    ports:
      - 8080
      - 6881:6881
      - 6881:6881/udp
    labels:
      - "traefik.enable=true"
volumes:
  qb_config:
  qb_downloads:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
