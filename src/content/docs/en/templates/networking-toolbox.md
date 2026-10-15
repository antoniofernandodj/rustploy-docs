---
title: Host Networking Toolbox with Rustploy
description: "Web panel with dozens of quick utilities for network testing. Create Networking Toolbox in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Networking Toolbox**: Web panel with dozens of quick utilities for network testing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `networking-toolbox` |
| **Containers** | 1 (`app`) |
| **Images** | `lissy93/networking-toolbox:latest` |
| **UI port** | 3000, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Networking Toolbox** and select it.
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
| `NODE_ENV` | production |
| `PORT` | 3000 |
| `HOST` | 0.0.0.0 |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    image: lissy93/networking-toolbox:latest
    expose:
      - "3000"
    environment:
      NODE_ENV: ${NODE_ENV}
      PORT: ${PORT}
      HOST: ${HOST}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
