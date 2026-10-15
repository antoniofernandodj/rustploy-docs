---
title: Host Mautic with Rustploy
description: "Complete digital marketing automation and lead management system. Create Mautic in one click on Rustploy: 5 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mautic**: Complete digital marketing automation and lead management system. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mautic` |
| **Containers** | 5 (`mysql`, `mautic`, `mautic-cron`, `mautic-worker`, `phpmyadmin`) |
| **Images** | `mysql:8.0`, `mautic/mautic:5.1.1-apache`, `phpmyadmin/phpmyadmin` |
| **UI port** | 80, on service `mautic` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mautic** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `mautic_domain` | *domain (generated; replace it with yours)* |
| `pma_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `root_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MAUTIC_URL` | https://${mautic_domain} |
| `MAUTIC_DB_HOST` | mysql |
| `MAUTIC_DB_PORT` | 3306 |
| `MAUTIC_DB_DATABASE` | mautic |
| `MAUTIC_DB_USER` | mautic |
| `MAUTIC_DB_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${root_password} |
| `MAUTIC_TRUSTED_PROXIES` | ["0.0.0.0/0"] |
| `MAUTIC_MESSENGER_DSN_EMAIL` | doctrine://default |
| `MAUTIC_MESSENGER_DSN_HIT` | doctrine://default |
| `PHP_INI_DATE_TIMEZONE` | UTC |
| `PHP_MEMORY_LIMIT` | 512M |

## Domains

| Service | Port | Host |
|---|---|---|
| `mautic` | 80 | ${mautic_domain} |
| `phpmyadmin` | 80 | ${pma_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  # -------------------------------------------------------------------------
  # Service 1: Database
  # -------------------------------------------------------------------------
  mysql:
    image: mysql:8.0
    command: --default-authentication-plugin=mysql_native_password
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MAUTIC_DB_DATABASE}
      MYSQL_USER: ${MAUTIC_DB_USER}
      MYSQL_PASSWORD: ${MAUTIC_DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # -------------------------------------------------------------------------
  # Service 2: Mautic Web (The Leader)
  # -------------------------------------------------------------------------
  mautic:
    image: mautic/mautic:5.1.1-apache
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
    ports:
      - 80
    environment:
      - DOCKER_MAUTIC_ROLE=mautic_web
      - DOCKER_MAUTIC_RUN_MIGRATIONS=true
      - MAUTIC_DB_HOST=${MAUTIC_DB_HOST}
      - MAUTIC_DB_PORT=${MAUTIC_DB_PORT}
      - MAUTIC_DB_DATABASE=${MAUTIC_DB_DATABASE}
      - MAUTIC_DB_USER=${MAUTIC_DB_USER}
      - MAUTIC_DB_PASSWORD=${MAUTIC_DB_PASSWORD}
      - MAUTIC_URL=${MAUTIC_URL}
      - MAUTIC_TRUSTED_PROXIES=${MAUTIC_TRUSTED_PROXIES}
      - MAUTIC_MESSENGER_DSN_EMAIL=${MAUTIC_MESSENGER_DSN_EMAIL}
      - MAUTIC_MESSENGER_DSN_HIT=${MAUTIC_MESSENGER_DSN_HIT}
      - PHP_INI_DATE_TIMEZONE=${PHP_INI_DATE_TIMEZONE}
      - PHP_MEMORY_LIMIT=${PHP_MEMORY_LIMIT}
    volumes:
      - mautic_data:/var/www/html
    # AUTOMATION FIX 1: Force permissions to be correct on every start
    entrypoint: ["/bin/sh", "-c", "chown -R www-data:www-data /var/www/html && /entrypoint.sh apache2-foreground"]
    # AUTOMATION FIX 2: Check if the CONFIG FILE exists. If not, report 'unhealthy'.
    # This signals the other containers to keep waiting.
    healthcheck:
      test: ["CMD-SHELL", "test -f /var/www/html/config/local.php || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 300s # Give you 5 mins to run the installer before marking failed

  # -------------------------------------------------------------------------
  # Service 3: Mautic Cron (Waits for Install)
  # -------------------------------------------------------------------------
  mautic-cron:
    image: mautic/mautic:5.1.1-apache
    restart: unless-stopped
    depends_on:
      mautic:
        condition: service_healthy # AUTOMATION FIX 3: Do not start until config file exists
    environment:
      - DOCKER_MAUTIC_ROLE=mautic_cron
      - MAUTIC_DB_HOST=${MAUTIC_DB_HOST}
      - MAUTIC_DB_PORT=${MAUTIC_DB_PORT}
      - MAUTIC_DB_DATABASE=${MAUTIC_DB_DATABASE}
      - MAUTIC_DB_USER=${MAUTIC_DB_USER}
      - MAUTIC_DB_PASSWORD=${MAUTIC_DB_PASSWORD}
      - MAUTIC_URL=${MAUTIC_URL}
      - PHP_INI_DATE_TIMEZONE=${PHP_INI_DATE_TIMEZONE}
    volumes:
      - mautic_data:/var/www/html

  # -------------------------------------------------------------------------
  # Service 4: Mautic Worker (Waits for Install)
  # -------------------------------------------------------------------------
  mautic-worker:
    image: mautic/mautic:5.1.1-apache
    restart: unless-stopped
    depends_on:
      mautic:
        condition: service_healthy # AUTOMATION FIX 3: Do not start until config file exists
    deploy:
      resources:
        limits:
          memory: 512M
    environment:
      - DOCKER_MAUTIC_ROLE=mautic_worker
      - DOCKER_MAUTIC_WORKERS_CONSUME_EMAIL=2
      - DOCKER_MAUTIC_WORKERS_CONSUME_HIT=2
      - DOCKER_MAUTIC_WORKERS_CONSUME_FAILED=2
      - MAUTIC_DB_HOST=${MAUTIC_DB_HOST}
      - MAUTIC_DB_PORT=${MAUTIC_DB_PORT}
      - MAUTIC_DB_DATABASE=${MAUTIC_DB_DATABASE}
      - MAUTIC_DB_USER=${MAUTIC_DB_USER}
      - MAUTIC_DB_PASSWORD=${MAUTIC_DB_PASSWORD}
      - MAUTIC_URL=${MAUTIC_URL}
      - MAUTIC_MESSENGER_DSN_EMAIL=${MAUTIC_MESSENGER_DSN_EMAIL}
      - MAUTIC_MESSENGER_DSN_HIT=${MAUTIC_MESSENGER_DSN_HIT}
      - PHP_INI_DATE_TIMEZONE=${PHP_INI_DATE_TIMEZONE}
    volumes:
      - mautic_data:/var/www/html

  # -------------------------------------------------------------------------
  # Service 5: phpMyAdmin
  # -------------------------------------------------------------------------
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      UPLOAD_LIMIT: 64M
    ports:
      - 80

volumes:
  mysql_data:
  mautic_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
