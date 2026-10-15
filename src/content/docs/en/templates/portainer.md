---
title: Host Portainer with Rustploy
description: "The classic, indispensable visual panel for managing Docker and Swarm instances. Create Portainer in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Portainer**: The classic, indispensable visual panel for managing Docker and Swarm instances. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `portainer` |
| **Containers** | 1 (`portainer`) |
| **Images** | `portainer/portainer-ce:latest` |
| **UI port** | 9000, on service `portainer` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Portainer** and select it.
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
| `portainer` | 9000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer-data:/data
    ports:
      - 9000

volumes:
  portainer-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
