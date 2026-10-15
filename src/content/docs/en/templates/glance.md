---
title: Host Glance with Rustploy
description: "Unified feed that gathers RSS feeds, weather, bookmarks and monitoring. Create Glance in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Glance**: Unified feed that gathers RSS feeds, weather, bookmarks and monitoring. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `glance` |
| **Containers** | 1 (`glance`) |
| **Images** | `glanceapp/glance` |
| **UI port** | 8080, on service `glance` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Glance** and select it.
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
| `glance` | 8080 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/app/config/glance.yml`

## The template docker-compose.yml

```yaml
services:
  glance:
    image: glanceapp/glance
    volumes:
      - ../files/app/config/:/app/config
      - ../files/app/assets:/app/assets
      # Optionally, also mount docker socket if you want to use the docker containers widget
      # - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 8080
    env_file: .env
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
