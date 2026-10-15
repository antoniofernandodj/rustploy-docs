---
title: Host AList with Rustploy
description: "Aggregates multiple file storages behind WebDAV. Create AList in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AList**: Aggregates multiple file storages behind WebDAV. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `alist` |
| **Containers** | 1 (`alist`) |
| **Images** | `xhofe/alist:v3.55.0` |
| **UI port** | 5244, on service `alist` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AList** and select it.
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
| `alist` | 5244 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.3'
services:
  alist:
    image: xhofe/alist:v3.55.0
    volumes:
      - alist-data:/opt/alist/data
    environment:
      - PUID=0
      - PGID=0
      - UMASK=022
    restart: unless-stopped

volumes:
  alist-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
