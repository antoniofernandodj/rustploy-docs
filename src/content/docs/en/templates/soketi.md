---
title: Host Soketi with Rustploy
description: "Ultra-fast WebSockets server built on Node.js (compatible with the Laravel Pusher ecosystem). Create Soketi in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Soketi**: Ultra-fast WebSockets server built on Node.js (compatible with the Laravel Pusher ecosystem). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `soketi` |
| **Containers** | 1 (`soketi`) |
| **Images** | `quay.io/soketi/soketi:1.6.1-16-debian` |
| **UI port** | 6001, on service `soketi` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Soketi** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `metrics_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `soketi` | 6001 | ${main_domain} |
| `soketi` | 9601 | ${metrics_domain} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  soketi:
    image: quay.io/soketi/soketi:1.6.1-16-debian
    environment:
      SOKETI_DEBUG: "1"
      SOKETI_HOST: "0.0.0.0"
      SOKETI_PORT: "6001"
      SOKETI_METRICS_SERVER_PORT: "9601"
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
