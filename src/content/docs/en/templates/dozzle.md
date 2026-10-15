---
title: Host Dozzle with Rustploy
description: "Lightweight, real-time viewer for Docker container logs. Create Dozzle in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Dozzle**: Lightweight, real-time viewer for Docker container logs. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dozzle` |
| **Containers** | 1 (`dozzle`) |
| **Images** | `amir20/dozzle:latest` |
| **UI port** | 8080, on service `dozzle` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Dozzle** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `docker_socket` | /var/run/docker.sock |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOZZLE_USERNAME` | *generated username* |
| `DOZZLE_PASSWORD` | *random password, 16 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `dozzle` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  dozzle:
    image: amir20/dozzle:latest
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    expose:
      - 8080
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
