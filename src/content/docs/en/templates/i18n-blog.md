---
title: Host I18n Blog with Rustploy
description: "I18n Blog application. Create I18n Blog in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**I18n Blog**: I18n Blog application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `i18n-blog` |
| **Containers** | 1 (`kuno`) |
| **Images** | `ictrun/kuno:latest` |
| **UI port** | 80, on service `kuno` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **I18n Blog** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 32 characters* |
| `recovery_mode` | false |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | https://${main_domain}/api |
| `DB_PATH` | /app/data/blog.db |
| `UPLOAD_DIR` | /app/data/uploads |
| `GIN_MODE` | release |
| `NODE_ENV` | production |
| `JWT_SECRET` | *generated JWT* |
| `RECOVERY_MODE` | ${recovery_mode} |

## Domains

| Service | Port | Host |
|---|---|---|
| `kuno` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  kuno:
    image: ictrun/kuno:latest
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
      DB_PATH: /app/data/blog.db
      UPLOAD_DIR: /app/data/uploads
      GIN_MODE: release
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      RECOVERY_MODE: ${RECOVERY_MODE}
    volumes:
      - kuno-data:/app/data

volumes:
  kuno-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
