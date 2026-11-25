---
title: Host ruTorrent with Rustploy
description: "Robust classic web interface for the stable rTorrent client. Create ruTorrent in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ruTorrent**: Robust classic web interface for the stable rTorrent client. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rutorrent` |
| **Containers** | 1 (`rutorrent`) |
| **Images** | `crazymax/rtorrent-rutorrent:latest` |
| **UI port** | 8080, on service `rutorrent` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ruTorrent** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `puid` | ${PUID:-1000} |
| `pgid` | ${PGID:-1000} |
| `incoming_port` | ${INCOMING_PORT:-50000} |
| `dht_port` | ${DHT_PORT:-6881} |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PUID` | ${puid} |
| `PGID` | ${pgid} |
| `INCOMING_PORT` | ${incoming_port} |
| `DHT_PORT` | ${dht_port} |

## Domains

| Service | Port | Host |
|---|---|---|
| `rutorrent` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  rutorrent:
    image: crazymax/rtorrent-rutorrent:latest
    restart: unless-stopped
    environment:
      - PUID=${PUID:-1000}
      - PGID=${PGID:-1000}
      # Optional: keep defaults, Dokploy will route 8080 via domain
      - RUTORRENT_PORT=8080
      - XMLRPC_PORT=8000
      # You can customize these if you like:
      - RT_DHT_PORT=${DHT_PORT:-6881}
      - RT_INC_PORT=${INCOMING_PORT:-50000}
    volumes:
      - rutorrent-data:/data
      - rutorrent-downloads:/downloads
      - rutorrent-passwd:/passwd
    # Expose only P2P-related ports; Dokploy domain will handle the web UI.
    ports:
      - "${INCOMING_PORT:-50000}:50000/tcp"
      - "${DHT_PORT:-6881}:6881/udp"

volumes:
  rutorrent-data: {}
  rutorrent-downloads: {}
  rutorrent-passwd: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
