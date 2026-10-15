---
title: Host YOURLS with Rustploy
description: "Classic PHP system for creating private link shorteners under the user's full control. Create YOURLS in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**YOURLS**: Classic PHP system for creating private link shorteners under the user's full control. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `yourls` |
| **Containers** | 2 (`yourls-app`, `yourls-mysql`) |
| **Images** | `yourls:1.9.2`, `mysql:5.7` |
| **UI port** | 80, on service `yourls-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **YOURLS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `mysql_password` | *random password* |
| `mysql_root_password` | *random password* |
| `admin_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `YOURLS_HOST` | ${main_domain} |
| `YOURLS_ADMIN_USER` | admin |
| `YOURLS_ADMIN_PASSWORD` | ${admin_password} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `yourls-app` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.7'

services:
  yourls-app:
    image: yourls:1.9.2

    environment:
      YOURLS_SITE: https://${YOURLS_HOST}
      YOURLS_USER: ${YOURLS_ADMIN_USER}
      YOURLS_PASS: ${YOURLS_ADMIN_PASSWORD}
      YOURLS_DB_HOST: yourls-mysql
      YOURLS_DB_USER: yourls
      YOURLS_DB_PASS: ${MYSQL_PASSWORD}
      YOURLS_DB_NAME: yourls
    volumes:
      - yourls-data:/var/www/html
    depends_on:
      yourls-mysql:
        condition: service_healthy
    restart: always

  yourls-mysql:
    image: mysql:5.7

    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: yourls
      MYSQL_USER: yourls
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - yourls-mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u$$MYSQL_USER", "-p$$MYSQL_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

volumes:
  yourls-data:
  yourls-mysql-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
