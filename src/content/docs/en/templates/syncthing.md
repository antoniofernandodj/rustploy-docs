---
title: Host Syncthing with Rustploy
description: "Continuous, decentralized real-time directory sync across multiple computers. Create Syncthing in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Syncthing**: Continuous, decentralized real-time directory sync across multiple computers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `syncthing` |
| **Containers** | 1 (`syncthing`) |
| **Images** | `lscr.io/linuxserver/syncthing:latest` |
| **UI port** | 8384, on service `syncthing` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Syncthing** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `timezone` | America/Sao_Paulo |

## Domains

| Service | Port | Host |
|---|---|---|
| `syncthing` | 8384 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  syncthing:
    image: lscr.io/linuxserver/syncthing:latest
    restart: unless-stopped
    expose:
      - 8384
      - 22000
      - 21027/udp
    volumes:
      - syncthing_config:/config
      - syncthing_data:/var/syncthing/Sync
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${timezone}

volumes:
  syncthing_config:
  syncthing_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
