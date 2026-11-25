---
title: Host HortusFox with Rustploy
description: "Plant, photo and routine management system for plant lovers. Create HortusFox in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**HortusFox**: Plant, photo and routine management system for plant lovers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `hortusfox` |
| **Containers** | 2 (`app`, `db`) |
| **Images** | `ghcr.io/danielbrendel/hortusfox-web:latest`, `mariadb:11` |
| **UI port** | 80, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **HortusFox** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `APP_ADMIN_EMAIL` | *generated email* |
| `APP_ADMIN_PASSWORD` | *random password, 16 characters* |
| `APP_TIMEZONE` | UTC |
| `DB_DATABASE` | hortusfox |
| `DB_USERNAME` | hortususer |
| `DB_PASSWORD` | *random password, 20 characters* |
| `MARIADB_ROOT_PASSWORD` | *random password, 24 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_ADMIN_EMAIL` | ${APP_ADMIN_EMAIL} |
| `APP_ADMIN_PASSWORD` | ${APP_ADMIN_PASSWORD} |
| `APP_TIMEZONE` | ${APP_TIMEZONE} |
| `DB_DATABASE` | ${DB_DATABASE} |
| `DB_USERNAME` | ${DB_USERNAME} |
| `DB_PASSWORD` | ${DB_PASSWORD} |
| `MARIADB_ROOT_PASSWORD` | ${MARIADB_ROOT_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    image: ghcr.io/danielbrendel/hortusfox-web:latest
    restart: unless-stopped
    volumes:
      - app_images:/var/www/html/public/img
      - app_logs:/var/www/html/app/logs
      - app_backup:/var/www/html/public/backup
      - app_themes:/var/www/html/public/themes
      - app_migrate:/var/www/html/app/migrations
    environment:
      APP_ADMIN_EMAIL: ${APP_ADMIN_EMAIL}
      APP_ADMIN_PASSWORD: ${APP_ADMIN_PASSWORD}
      APP_TIMEZONE: ${APP_TIMEZONE}
      DB_HOST: db
      DB_PORT: 3306
      DB_DATABASE: ${DB_DATABASE}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_CHARSET: utf8mb4
    depends_on:
      - db

  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: ${MARIADB_ROOT_PASSWORD}
      MARIADB_DATABASE: ${DB_DATABASE}
      MARIADB_USER: ${DB_USERNAME}
      MARIADB_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
  app_images:
  app_logs:
  app_backup:
  app_themes:
  app_migrate:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
