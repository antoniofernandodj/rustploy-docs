---
title: Host Parseable with Rustploy
description: "Log analytics and observability system built natively for object storage. Create Parseable in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Parseable**: Log analytics and observability system built natively for object storage. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `parseable` |
| **Containers** | 1 (`parseable`) |
| **Images** | `parseable/parseable:v1.6.0` |
| **UI port** | 8000, on service `parseable` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Parseable** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `parseable_username` | *generated username* |
| `parseable_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PARSEABLE_USERNAME` | ${parseable_username} |
| `PARSEABLE_PASSWORD` | ${parseable_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `parseable` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  parseable:
    image: parseable/parseable:v1.6.0
    command: parseable local-store
    restart: unless-stopped
    volumes:
      - parseable-staging:/parseable/staging
      - parseable-data:/parseable/data
    environment:
      - P_ADDR=0.0.0.0:8000
      - P_USERNAME=${PARSEABLE_USERNAME}
      - P_PASSWORD=${PARSEABLE_PASSWORD}
      - P_STAGING_DIR=/parseable/staging
      - P_FS_DIR=/parseable/data
    ports:
      - 8000
      - 8001
      - 8002
volumes:
  parseable-staging: {}
  parseable-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
