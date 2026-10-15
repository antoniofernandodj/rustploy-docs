---
title: Host Kimai with Rustploy
description: "Multi-user time-tracking system for working hours. Create Kimai in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Kimai**: Multi-user time-tracking system for working hours. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kimai` |
| **Containers** | 2 (`app`, `db`) |
| **Images** | `kimai/kimai2:apache-2.31.0`, `mariadb:10.11` |
| **UI port** | 8001, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Kimai** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_password` | *random password, 32 characters* |
| `mysql_password` | *random password, 32 characters* |
| `mysql_root_password` | *random password, 32 characters* |
| `app_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `KI_HOST` | ${main_domain} |
| `KI_ADMINMAIL` | admin@kimai.local |
| `KI_ADMINPASS` | ${admin_password} |
| `KI_MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `KI_MYSQL_PASSWORD` | ${mysql_password} |
| `KI_APP_SECRET` | ${app_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 8001 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  app:
    image: kimai/kimai2:apache-2.31.0
    restart: unless-stopped
    environment:
      APP_ENV: prod
      DATABASE_URL: mysql://kimai:${KI_MYSQL_PASSWORD:-kimai}@db/kimai
      TRUSTED_PROXIES: localhost
      APP_SECRET: ${KI_APP_SECRET}
      MAILER_FROM: ${KI_MAILER_FROM:-admin@kimai.local}
      MAILER_URL: ${KI_MAILER_URL:-null://null}
      ADMINMAIL: ${KI_ADMINMAIL:-admin@kimai.local}
      ADMINPASS: ${KI_ADMINPASS}
    volumes:
      - kimai-data:/opt/kimai/var
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      - MYSQL_DATABASE=kimai
      - MYSQL_USER=kimai
      - MYSQL_PASSWORD=${KI_MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${KI_MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
      - --innodb-buffer-pool-size=256M
      - --innodb-flush-log-at-trx-commit=2
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "kimai", "-p${KI_MYSQL_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s


volumes:
  kimai-data:
  mysql-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
