---
title: Host Morphos with Rustploy
description: "Microservice focused on lightweight distributed orchestration tasks. Create Morphos in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Morphos**: Microservice focused on lightweight distributed orchestration tasks. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `morphos` |
| **Containers** | 1 (`morphos-server`) |
| **Images** | `ghcr.io/danvergara/morphos-server:latest` |
| **UI port** | 8080, on service `morphos-server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Morphos** and select it.
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
| `morphos-server` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  morphos-server:
    image: ghcr.io/danvergara/morphos-server:latest
    restart: unless-stopped
    expose:
      - 8080
    volumes:
      - ../files/morphos-upload:/upload:rw
    healthcheck:
      test: timeout 10s bash -c ':> /dev/tcp/127.0.0.1/8080' || exit 1
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 90s
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
