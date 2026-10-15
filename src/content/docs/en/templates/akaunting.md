---
title: Host Akaunting with Rustploy
description: "Open-source accounting software for small businesses. Create Akaunting in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Akaunting**: Open-source accounting software for small businesses. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `akaunting` |
| **Containers** | 2 (`akaunting`, `akaunting-db`) |
| **Images** | `docker.io/akaunting/akaunting:latest`, `mariadb:10.11` |
| **UI port** | 80, on service `akaunting` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Akaunting** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `locale` | en-US |
| `db_name` | akaunting |
| `db_user` | admin |
| `mysql_password` | *random password, 24 characters* |
| `company_name` | My Company |
| `company_email` | *generated email* |
| `admin_email` | *generated email* |
| `admin_password` | *random password, 24 characters* |
| `db_prefix` | *random hash*_ |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_URL` | ${main_domain} |
| `LOCALE` | ${locale} |
| `DB_HOST` | akaunting-db |
| `DB_PORT` | 3306 |
| `DB_NAME` | ${db_name} |
| `DB_USERNAME` | ${db_user} |
| `DB_PASSWORD` | ${mysql_password} |
| `DB_PREFIX` | ${db_prefix} |
| `COMPANY_NAME` | ${company_name} |
| `COMPANY_EMAIL` | ${company_email} |
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASSWORD` | ${admin_password} |
| `MYSQL_DATABASE` | ${db_name} |
| `MYSQL_USER` | ${db_user} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_RANDOM_ROOT_PASSWORD` | yes |

## Domains

| Service | Port | Host |
|---|---|---|
| `akaunting` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  akaunting:
    image: docker.io/akaunting/akaunting:latest
    restart: unless-stopped
    depends_on:
      akaunting-db:
        condition: service_healthy
    environment:
      # App config
      APP_URL: ${APP_URL}
      LOCALE: ${LOCALE}

      # Database connection
      DB_HOST: akaunting-db
      DB_PORT: 3306
      DB_NAME: ${DB_NAME}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_PREFIX: ${DB_PREFIX}

      # First-run bootstrap (company + admin)
      COMPANY_NAME: ${COMPANY_NAME}
      COMPANY_EMAIL: ${COMPANY_EMAIL}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}

    # Expose only to internal network; domain routing handled by Dokploy/Traefik
    expose:
      - "80"

    volumes:
      - akaunting-data:/var/www/html

  akaunting-db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      # Randomizes root password on each deployment (recommended)
      MYSQL_RANDOM_ROOT_PASSWORD: "yes"
    volumes:
      - akaunting-db:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  akaunting-data: {}
  akaunting-db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
