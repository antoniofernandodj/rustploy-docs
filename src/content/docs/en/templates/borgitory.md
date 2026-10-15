---
title: Host Borgitory with Rustploy
description: "Web interface to view and manage BorgBackup repositories. Create Borgitory in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Borgitory**: Web interface to view and manage BorgBackup repositories. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `borgitory` |
| **Containers** | 1 (`borgitory`) |
| **Images** | `mlapaglia/borgitory:latest` |
| **UI port** | 8000, on service `borgitory` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Borgitory** and select it.
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
| `borgitory` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  borgitory:
    image: mlapaglia/borgitory:latest
    restart: unless-stopped
    expose:
      - 8000
    cap_add:
      - SYS_ADMIN
    devices:
      - /dev/fuse
    volumes:
      - borgitory-data:/app/data
      - borgitory-sources:/mnt/sources:ro
      - borgitory-repos:/mnt/repos:ro

volumes:
  borgitory-data: {}
  borgitory-sources: {}
  borgitory-repos: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
