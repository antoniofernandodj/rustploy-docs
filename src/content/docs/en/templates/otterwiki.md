---
title: Host Otter Wiki with Rustploy
description: "Python and Flask wiki engine focused on simplicity, with Markdown writing. Create Otter Wiki in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Otter Wiki**: Python and Flask wiki engine focused on simplicity, with Markdown writing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `otterwiki` |
| **Containers** | 1 (`otterwiki`) |
| **Images** | `redimp/otterwiki:2` |
| **UI port** | 80, on service `otterwiki` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Otter Wiki** and select it.
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
| `otterwiki` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  otterwiki:
    image: redimp/otterwiki:2
    restart: unless-stopped
    volumes:
      - otterwiki-data:/app-data

volumes:
  otterwiki-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
