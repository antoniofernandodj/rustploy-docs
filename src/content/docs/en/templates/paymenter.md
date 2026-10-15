---
title: Host Paymenter with Rustploy
description: "Billing, automatic invoicing and customer area for hosting providers. Create Paymenter in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Paymenter**: Billing, automatic invoicing and customer area for hosting providers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `paymenter` |
| **Containers** | 3 (`database`, `cache`, `paymenter`) |
| **Images** | `mariadb:lts`, `redis:alpine`, `ghcr.io/paymenter/paymenter:latest` |
| **UI port** | 80, on service `paymenter` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Paymenter** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `app_key` | *random base64 key (32 bytes)* |
| `mysql_password` | *random password, 16 characters* |
| `mysql_root_password` | *random password, 20 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_URL` | https://${main_domain} |
| `APP_KEY` | base64:${app_key} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `MYSQL_DATABASE` | paymenter |
| `MYSQL_USER` | paymenter |

## Domains

| Service | Port | Host |
|---|---|---|
| `paymenter` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  database:
    image: mariadb:lts
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - paymenter-database:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE:-paymenter}
      - MYSQL_USER=${MYSQL_USER:-paymenter}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}

  cache:
    image: redis:alpine
    restart: unless-stopped
    volumes:
      - paymenter-redis:/data

  paymenter:
    image: ghcr.io/paymenter/paymenter:latest
    restart: unless-stopped
    ports:
      - 80
    depends_on:
      - database
      - cache
    volumes:
      - paymenter-storage:/app/var
      - paymenter-logs:/app/storage/logs
      - paymenter-public:/app/storage/app/public
    environment:
      - APP_ENV=${APP_ENV:-production}
      - APP_DEBUG=false
      - APP_KEY=${APP_KEY}
      - APP_URL=${APP_URL}
      - DB_CONNECTION=mysql
      - DB_HOST=database
      - DB_PORT=3306
      - DB_DATABASE=${MYSQL_DATABASE:-paymenter}
      - DB_USERNAME=${MYSQL_USER:-paymenter}
      - DB_PASSWORD=${MYSQL_PASSWORD}
      - CACHE_STORE=redis
      - REDIS_HOST=cache
      - REDIS_PORT=6379
      - TRUSTED_PROXIES=*

volumes:
  paymenter-database: {}
  paymenter-storage: {}
  paymenter-logs: {}
  paymenter-public: {}
  paymenter-redis: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
