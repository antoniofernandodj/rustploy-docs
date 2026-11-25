---
title: Host ClassicPress with Rustploy
description: "Creator-focused CMS (stable WordPress fork with the classic editor). Create ClassicPress in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ClassicPress**: Creator-focused CMS (stable WordPress fork with the classic editor). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `classicpress` |
| **Containers** | 2 (`classicpress`, `db`) |
| **Images** | `classicpress/classicpress:php8.3-apache`, `mariadb:10.6` |
| **UI port** | 80, on service `classicpress` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ClassicPress** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `DB_PASSWORD` | *random password, 16 characters* |
| `DB_ROOT_PASSWORD` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${DB_PASSWORD} |
| `DB_ROOT_PASSWORD` | ${DB_ROOT_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `classicpress` | 80 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  classicpress:
    image: classicpress/classicpress:php8.3-apache
    ports:
      - "80"
    environment:
      - WORDPRESS_DB_HOST=db
      - WORDPRESS_DB_USER=wordpress
      - WORDPRESS_DB_PASSWORD=${DB_PASSWORD}
      - WORDPRESS_DB_NAME=wordpress
    volumes:
      - wordpress-data:/var/www/html
    depends_on:
      - db

  db:
    image: mariadb:10.6
    environment:
      - MYSQL_DATABASE=wordpress
      - MYSQL_USER=wordpress
      - MYSQL_PASSWORD=${DB_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql

volumes:
  wordpress-data:
  db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
