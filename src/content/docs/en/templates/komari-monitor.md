---
title: Host Komari Monitor with Rustploy
description: "Lightweight web dashboard for a quick view of hardware performance. Create Komari Monitor in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Komari Monitor**: Lightweight web dashboard for a quick view of hardware performance. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `komari-monitor` |
| **Containers** | 1 (`komari`) |
| **Images** | `ghcr.io/komari-monitor/komari:latest` |
| **UI port** | 25774, on service `komari` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Komari Monitor** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ADMIN_USERNAME` | admin |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `komari` | 25774 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  komari:
    image: ghcr.io/komari-monitor/komari:latest
    restart: unless-stopped
    volumes:
      - komari-data:/app/data
    environment:
      - ADMIN_USERNAME
      - ADMIN_PASSWORD

volumes:
  komari-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
