---
title: Host Excalidraw with Rustploy
description: "Virtual whiteboard for hand-drawn sketches and diagrams. Create Excalidraw in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Excalidraw**: Virtual whiteboard for hand-drawn sketches and diagrams. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `excalidraw` |
| **Containers** | 1 (`excalidraw`) |
| **Images** | `excalidraw/excalidraw:latest` |
| **UI port** | 80, on service `excalidraw` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Excalidraw** and select it.
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
| `excalidraw` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  excalidraw:
    restart: unless-stopped
    image: excalidraw/excalidraw:latest
    healthcheck:
      test:
        - CMD
        - wget
        - '--spider'
        - '--quiet'
        - 'http://localhost'
      interval: 30s
      timeout: 5s
      retries: 3
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
