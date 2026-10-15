---
title: Host Lodestone with Rustploy
description: "Intuitive management panel for Minecraft and other multiplayer game servers. Create Lodestone in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Lodestone**: Intuitive management panel for Minecraft and other multiplayer game servers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `lodestone` |
| **Containers** | 2 (`lodestone`, `lodestone_dashboard`) |
| **Images** | `ghcr.io/lodestone-team/lodestone_core`, `ghcr.io/lodestone-team/lodestone_dashboard:v0.5.1` |
| **UI port** | 80, on service `lodestone_dashboard` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Lodestone** and select it.
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
| `lodestone_dashboard` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  lodestone:
    image: ghcr.io/lodestone-team/lodestone_core
    ports:
      - "16662:16662"
      - "25565-25590:25565-25590" 
    volumes:
      - lodestone:/home/user/.lodestone
    restart: unless-stopped

  lodestone_dashboard:
    image: ghcr.io/lodestone-team/lodestone_dashboard:v0.5.1
    restart: always  

volumes:
  lodestone:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
