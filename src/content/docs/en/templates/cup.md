---
title: Host Cup with Rustploy
description: "Lightweight GUI for managing local Docker containers. Create Cup in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cup**: Lightweight GUI for managing local Docker containers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cup` |
| **Containers** | 1 (`cup`) |
| **Images** | `ghcr.io/sergi0g/cup:latest` |
| **UI port** | 8000, on service `cup` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cup** and select it.
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
| `cup` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  cup:
    image: ghcr.io/sergi0g/cup:latest
    restart: unless-stopped
    command: serve
    ports:
      - "8000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
