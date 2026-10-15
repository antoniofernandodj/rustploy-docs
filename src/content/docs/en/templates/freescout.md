---
title: Host FreeScout with Rustploy
description: "Help desk and customer support hub (HelpScout and Zendesk alternative). Create FreeScout in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**FreeScout**: Help desk and customer support hub (HelpScout and Zendesk alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `freescout` |
| **Containers** | 2 (`freescout-db`, `freescout`) |
| **Images** | `mariadb:10.6`, `tiredofit/freescout:latest` |
| **UI port** | 80, on service `freescout` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **FreeScout** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `mysql_root_password` | *random password, 16 characters* |
| `admin_email` | *generated email* |
| `admin_password` | *random password, 16 characters* |
| `db_name` | freescout |
| `db_user` | freescout_user |
| `db_pass` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASS` | ${db_pass} |
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASS` | ${admin_password} |
| `ADMIN_FIRST_NAME` | Admin |
| `ADMIN_LAST_NAME` | User |
| `SITE_URL` | http://${main_domain} |
| `APPLICATION_NAME` | Customer Support |
| `APP_PROXY` |  |
| `APP_TRUSTED_PROXIES` | 172.16.0.0/12,192.168.0.0/16,10.0.0.0/8 |

## Domains

| Service | Port | Host |
|---|---|---|
| `freescout` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  freescout-db:
    image: mariadb:10.6
    volumes:
      - freescout-db-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASS}
    healthcheck:
      test:
        [
          "CMD",
          "mysqladmin",
          "ping",
          "-h",
          "localhost",
          "-u",
          "root",
          "-p${MYSQL_ROOT_PASSWORD}",
        ]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  freescout:
    image: tiredofit/freescout:latest
    volumes:
      - freescout-data:/data
      - freescout-html:/www/html
      - freescout-logs:/www/logs
    depends_on:
      freescout-db:
        condition: service_healthy
    environment:
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASS=${ADMIN_PASS}
      - ADMIN_FIRST_NAME=${ADMIN_FIRST_NAME}
      - ADMIN_LAST_NAME=${ADMIN_LAST_NAME}
      - SITE_URL=${SITE_URL}
      - DB_HOST=freescout-db
      - DB_PORT=3306
      - DB_TYPE=mysql
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - APPLICATION_NAME=${APPLICATION_NAME}
      - SETUP_TYPE=AUTO
      - ENABLE_AUTO_UPDATE=TRUE
      - DISPLAY_ERRORS=FALSE
      - APP_PROXY=${APP_PROXY}
      - APP_TRUSTED_PROXIES=${APP_TRUSTED_PROXIES}
    restart: unless-stopped

volumes:
  freescout-db-data:
  freescout-data:
  freescout-html:
  freescout-logs:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
