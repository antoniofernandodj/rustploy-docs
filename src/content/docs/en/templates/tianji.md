---
title: Host Tianji with Rustploy
description: "Unified dashboard combining web traffic analytics with server uptime monitoring. Create Tianji in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Tianji**: Unified dashboard combining web traffic analytics with server uptime monitoring. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `tianji` |
| **Containers** | 2 (`tianji`, `postgres`) |
| **Images** | `moonrailgun/tianji`, `postgres:15.4-alpine` |
| **UI port** | 12345, on service `tianji` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Tianji** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 32 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `tianji` | 12345 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3'
services:
  tianji:
    image: moonrailgun/tianji
    ports:
      - "12345"
    environment:
      DATABASE_URL: postgresql://tianji:tianji@postgres:5432/tianji
      # API Key
      JWT_SECRET: ${jwt_secret}
      ALLOW_REGISTER: "false"
      ALLOW_OPENAPI: "true"
    depends_on:
      - postgres
  postgres:
    image: postgres:15.4-alpine
    environment:
      POSTGRES_DB: tianji
      POSTGRES_USER: tianji
      POSTGRES_PASSWORD: tianji
    volumes:
      - tianji-db-data:/var/lib/postgresql/data
volumes:
  tianji-db-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
