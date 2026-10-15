---
title: Host Wordpress with Rustploy
description: "The world's most widely used CMS for building and managing websites and blogs. Create Wordpress in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Wordpress**: The world's most widely used CMS for building and managing websites and blogs. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `wordpress` |
| **Containers** | 2 (`wordpress`, `wp_db`) |
| **Images** | `wordpress:latest`, `mysql:8.4` |
| **UI port** | 80, on service `wordpress` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Wordpress** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_name` | wordpress |
| `db_user` | wordpress |
| `db_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `WORDPRESS_DEBUG` | 0 |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `wordpress` | 80 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `uploads.ini`

## The template docker-compose.yml

```yaml
services:
  wordpress:
    image: wordpress:latest
    volumes:
      - wp_app:/var/www/html
      - ../files/uploads.ini:/usr/local/etc/php/conf.d/uploads.ini
    environment:
      WORDPRESS_DB_HOST: wp_db
      WORDPRESS_DB_NAME: $DB_NAME
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: $DB_PASSWORD
      WORDPRESS_DEBUG: ${WORDPRESS_DEBUG:-0}
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_MEMORY_LIMIT', '256M');
        define('DISALLOW_FILE_EDIT', true);
    depends_on:
      wp_db:
        condition: service_healthy
    restart: unless-stopped

  wp_db:
    image: mysql:8.4
    restart: unless-stopped
    volumes:
      - wp_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: $DB_PASSWORD
      MYSQL_DATABASE: $DB_NAME
    healthcheck:
      test: ["CMD-SHELL", "exit | mysql -h localhost -P 3306 -u root -p$$MYSQL_ROOT_PASSWORD"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  wp_app:
  wp_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
