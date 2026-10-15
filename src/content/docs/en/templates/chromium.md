---
title: Host Chromium with Rustploy
description: "Open-source browser packaged to run in a container. Create Chromium in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Chromium**: Open-source browser packaged to run in a container. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `chromium` |
| **Containers** | 1 (`chromium`) |
| **Images** | `lscr.io/linuxserver/chromium:5f5dd27e-ls102` |
| **UI port** | 3000, on service `chromium` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Chromium** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Domains

| Service | Port | Host |
|---|---|---|
| `chromium` | 3000 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  chromium:
    image: lscr.io/linuxserver/chromium:5f5dd27e-ls102
    ports:
      - "3000"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
    volumes:
      - config:/config

volumes:
  config:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
