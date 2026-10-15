---
title: Host SilverBullet with Rustploy
description: "Extensible notepad that works as a dynamic personal knowledge base. Create SilverBullet in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**SilverBullet**: Extensible notepad that works as a dynamic personal knowledge base. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `silverbullet` |
| **Containers** | 2 (`silverbullet`, `watchtower`) |
| **Images** | `ghcr.io/silverbulletmd/silverbullet:v2`, `containrrr/watchtower` |
| **UI port** | 3000, on service `silverbullet` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **SilverBullet** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `sb_user` | admin:*random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SB_USER` | ${sb_user} |

## Domains

| Service | Port | Host |
|---|---|---|
| `silverbullet` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  silverbullet:
    image: ghcr.io/silverbulletmd/silverbullet:v2
    restart: unless-stopped
    environment:
      - SB_USER=${SB_USER}
    volumes:
      - silverbullet-space:/space
    expose:
      - 3000

  watchtower:
    image: containrrr/watchtower
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  silverbullet-space: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
