---
title: Host Drawnix with Rustploy
description: "Application for rendering and managing visual assets. Create Drawnix in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Drawnix**: Application for rendering and managing visual assets. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `drawnix` |
| **Containers** | 1 (`drawnix`) |
| **Images** | `pubuzhixing/drawnix:latest` |
| **UI port** | 3000, on service `drawnix` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Drawnix** and select it.
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
| `drawnix` | 3000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/app/config.txt`

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  drawnix:
    image: pubuzhixing/drawnix:latest
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
