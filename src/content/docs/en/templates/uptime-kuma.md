---
title: Host Uptime Kuma with Rustploy
description: "Visual uptime monitor for services and network ports with Telegram/Discord alerts. Create Uptime Kuma in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Uptime Kuma**: Visual uptime monitor for services and network ports with Telegram/Discord alerts. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `uptime-kuma` |
| **Containers** | 1 (`uptime-kuma`) |
| **Images** | `louislam/uptime-kuma:2.1.0` |
| **UI port** | 3001, on service `uptime-kuma` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Uptime Kuma** and select it.
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
| `uptime-kuma` | 3001 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2.1.0
    restart: always
    volumes:
      - uptime-kuma-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  uptime-kuma-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
