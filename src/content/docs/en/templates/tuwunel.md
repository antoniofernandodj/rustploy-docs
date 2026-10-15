---
title: Host Tuwunel with Rustploy
description: "High-performance Matrix server in Rust (official successor to Conduwuit for enterprise use). Create Tuwunel in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Tuwunel**: High-performance Matrix server in Rust (official successor to Conduwuit for enterprise use). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `tuwunel` |
| **Containers** | 1 (`tuwunel`) |
| **Images** | `ghcr.io/matrix-construct/tuwunel:v1.5.0` |
| **UI port** | 6167, on service `tuwunel` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Tuwunel** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `registration_token` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TUWUNEL_SERVER_NAME` | ${main_domain} |
| `TUWUNEL_REGISTRATION_TOKEN` | ${registration_token} |

## Domains

| Service | Port | Host |
|---|---|---|
| `tuwunel` | 6167 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  tuwunel:
    image: ghcr.io/matrix-construct/tuwunel:v1.5.0
    restart: always
    environment:
      - TUWUNEL_SERVER_NAME=${TUWUNEL_SERVER_NAME:-matrix.local}
      - TUWUNEL_ALLOW_REGISTRATION=${TUWUNEL_ALLOW_REGISTRATION:-false}
      - TUWUNEL_REGISTRATION_TOKEN=${TUWUNEL_REGISTRATION_TOKEN}
      - TUWUNEL_ADDRESS=${TUWUNEL_ADDRESS:-0.0.0.0}
      - TUWUNEL_PORT=${TUWUNEL_PORT:-6167}
    volumes:
      - tuwunel-data:/var/lib/tuwunel/
    expose:
      - 6167

volumes:
  tuwunel-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
