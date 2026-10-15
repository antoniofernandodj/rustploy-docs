---
title: Host Poke with Rustploy
description: "Private video-sharing platform that preserves anonymity. Create Poke in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Poke**: Private video-sharing platform that preserves anonymity. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `poke` |
| **Containers** | 1 (`poke`) |
| **Images** | `codeberg.org/poketube/poke:amd64` |
| **UI port** | 6003, on service `poke` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Poke** and select it.
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
| `poke` | 6003 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/poketube/config.json`

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  poke:
    image: codeberg.org/poketube/poke:amd64
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
