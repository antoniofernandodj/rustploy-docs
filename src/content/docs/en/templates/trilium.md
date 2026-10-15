---
title: Host Trilium with Rustploy
description: "Hierarchically structured note editor for building large knowledge bases. Create Trilium in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Trilium**: Hierarchically structured note editor for building large knowledge bases. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `trilium` |
| **Containers** | 1 (`trilium`) |
| **Images** | `zadam/trilium:latest` |
| **UI port** | 8080, on service `trilium` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Trilium** and select it.
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
| `trilium` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  trilium:
    image: zadam/trilium:latest
    ports:
      - 8080
    restart: always
    volumes:
      - /root/trilium-backups:/home/node/trilium-data/backup
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
