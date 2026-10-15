---
title: Host Tor Browser with Rustploy
description: "Tor browser instance accessible directly through a VNC-based web interface (noVNC). Create Tor Browser in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Tor Browser**: Tor browser instance accessible directly through a VNC-based web interface (noVNC). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `tor-browser` |
| **Containers** | 1 (`tor`) |
| **Images** | `domistyle/tor-browser` |
| **UI port** | 5800, on service `tor` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Tor Browser** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `display_width` | 1920 |
| `display_height` | 1080 |
| `keep_app_running` | 1 |
| `timezone` | Europe/Vienna |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DISPLAY_WIDTH` | ${display_width} |
| `DISPLAY_HEIGHT` | ${display_height} |
| `KEEP_APP_RUNNING` | ${keep_app_running} |
| `TZ` | ${timezone} |

## Domains

| Service | Port | Host |
|---|---|---|
| `tor` | 5800 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.9"

services:
  tor:
    image: domistyle/tor-browser
    restart: always
    expose:
      - 5800
      - 5900
    environment:
      DISPLAY_WIDTH: ${DISPLAY_WIDTH}
      DISPLAY_HEIGHT: ${DISPLAY_HEIGHT}
      KEEP_APP_RUNNING: ${KEEP_APP_RUNNING}
      TZ: ${TZ}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
