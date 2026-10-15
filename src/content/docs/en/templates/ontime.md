---
title: Host Ontime with Rustploy
description: "Rundown, countdown and schedule manager for live broadcast events. Create Ontime in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ontime**: Rundown, countdown and schedule manager for live broadcast events. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ontime` |
| **Containers** | 1 (`ontime`) |
| **Images** | `getontime/ontime:v3.8.0` |
| **UI port** | 4001, on service `ontime` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ontime** and select it.
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
| `TZ` | UTC |

## Domains

| Service | Port | Host |
|---|---|---|
| `ontime` | 4001 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  ontime:
    image: getontime/ontime:v3.8.0
    ports:
      - 4001
      - 8888
      - 9999
    volumes:
      - ontime-data:/data/
    environment:
      - TZ
    restart: unless-stopped
volumes:
  ontime-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
