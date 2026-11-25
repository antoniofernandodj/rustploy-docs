---
title: Host TRMNL BYOS Laravel with Rustploy
description: "Self-hosted Laravel application for managing TRMNL e-ink screens. Create TRMNL BYOS Laravel in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**TRMNL BYOS Laravel**: Self-hosted Laravel application for managing TRMNL e-ink screens. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `trmnl-byos-laravel` |
| **Containers** | 1 (`trmnl-byos-laravel`) |
| **Images** | `ghcr.io/usetrmnl/byos_laravel:0.27.0` |
| **UI port** | 8080, on service `trmnl-byos-laravel` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **TRMNL BYOS Laravel** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_URL` | ${main_domain} |
| `PHP_OPCACHE_ENABLE` | 1 |
| `APP_TIMEZONE` | UTC |
| `REGISTRATION_ENABLED` | 1 |
| `FORCE_HTTPS` | 0 |

## Domains

| Service | Port | Host |
|---|---|---|
| `trmnl-byos-laravel` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  trmnl-byos-laravel:
    image: ghcr.io/usetrmnl/byos_laravel:0.27.0
    environment:
      - APP_URL=${APP_URL}
      - PHP_OPCACHE_ENABLE=${PHP_OPCACHE_ENABLE}
      - DEPLOY_VARIANT="dokploy"
      - DB_DATABASE=database/storage/database.sqlite
      - APP_TIMEZONE=${APP_TIMEZONE}
      # - APP_KEY:
      - REGISTRATION_ENABLED=${REGISTRATION_ENABLED}
      - FORCE_HTTPS=${FORCE_HTTPS}
    restart: always
    volumes:
      - trmnl-database:/var/www/html/database/storage
      - trmnl-storage:/var/www/html/storage/app/public/images/generated
volumes:
  trmnl-database:
  trmnl-storage:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
