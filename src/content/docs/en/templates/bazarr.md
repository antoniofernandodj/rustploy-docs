---
title: Host Bazarr with Rustploy
description: "Automatic subtitle manager integrated with Sonarr/Radarr. Create Bazarr in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Bazarr**: Automatic subtitle manager integrated with Sonarr/Radarr. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bazarr` |
| **Containers** | 1 (`bazarr`) |
| **Images** | `lscr.io/linuxserver/bazarr:1.5.1` |
| **UI port** | 6767, on service `bazarr` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Bazarr** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `movies_path` | /path/to/movies |
| `tv_path` | /path/to/tv |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MOVIES_PATH` | ${movies_path} |
| `TV_PATH` | ${tv_path} |

## Domains

| Service | Port | Host |
|---|---|---|
| `bazarr` | 6767 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  bazarr:
    image: lscr.io/linuxserver/bazarr:1.5.1
    restart: unless-stopped
    ports:
      - 6767
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
    volumes:
      - config:/config
      - ${MOVIES_PATH}:/movies
      - ${TV_PATH}:/tv

volumes:
  config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
