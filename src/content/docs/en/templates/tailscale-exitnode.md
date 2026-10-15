---
title: Host Tailscale Exitnode with Rustploy
description: "Tailscale Exitnode application. Create Tailscale Exitnode in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Tailscale Exitnode**: Tailscale Exitnode application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `tailscale-exitnode` |
| **Containers** | 1 (`tailscale-exitnode`) |
| **Images** | `tailscale/tailscale:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Tailscale Exitnode** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TAILSCALE_HOSTNAME` |  |
| `TAILSCALE_AUTHKEY` |  |

## The template docker-compose.yml

```yaml
services:
  tailscale-exitnode:
    image: tailscale/tailscale:latest
    hostname: ${TAILSCALE_HOSTNAME}
    environment:
      - TS_AUTHKEY=${TAILSCALE_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-exit-node
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_USERSPACE=true
    volumes:
      - tailscale_exitnode_data:/var/lib/tailscale
    restart: always

volumes:
  tailscale_exitnode_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
