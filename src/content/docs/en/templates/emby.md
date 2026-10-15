---
title: Host Emby with Rustploy
description: "Private media server for streaming movies, shows and music. Create Emby in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Emby**: Private media server for streaming movies, shows and music. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `emby` |
| **Containers** | 1 (`emby`) |
| **Images** | `emby/embyserver` |
| **UI port** | 8096, on service `emby` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Emby** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `emby` | 8096 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "2.3"
services:
  emby:
    image: emby/embyserver
    # Uncomment to enable DLNA and Wake-on-Lan
    # network_mode: host
    environment:
      - UID=1000 # The UID to run emby as (default: 2)
      - GID=100 # The GID to run emby as (default 2)
      - GIDLIST=100 # A comma-separated list of additional GIDs to run emby as (default: 2)
    volumes:
      - /emby/programdata:/config # Configuration directory
      - /emby/series:/mnt/share1 # Media directory
      - /emby/movies:/mnt/share2 # Media directory
    ports:
      - 8096 # HTTP port
      - 8920 # HTTPS port
    devices:
      - /dev/dri:/dev/dri # VAAPI/NVDEC/NVENC render nodes
    restart: on-failure
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
