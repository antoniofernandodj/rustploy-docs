---
title: Host Homarr with Rustploy
description: "Modern home-app dashboard integrated with Docker. Create Homarr in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Homarr**: Modern home-app dashboard integrated with Docker. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `homarr` |
| **Containers** | 1 (`homarr`) |
| **Images** | `ghcr.io/homarr-labs/homarr:latest` |
| **UI port** | 7575, on service `homarr` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Homarr** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SECRET_ENCRYPTION_KEY` | ${secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `homarr` | 7575 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  homarr:
    image: ghcr.io/homarr-labs/homarr:latest
    restart: unless-stopped
    volumes:
      # - /var/run/docker.sock:/var/run/docker.sock # Optional, only if you want docker integration
      - ../homarr/appdata:/appdata
    environment:
      - SECRET_ENCRYPTION_KEY=${SECRET_ENCRYPTION_KEY}
    ports:
      - 7575
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
