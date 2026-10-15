---
title: Host Movary with Rustploy
description: "Personal tracker of watched movie history integrated with the TMDB database. Create Movary in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Movary**: Personal tracker of watched movie history integrated with the TMDB database. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `movary` |
| **Containers** | 2 (`movary`, `mysql`) |
| **Images** | `leepeuker/movary:${MOVARY_VERSION:-latest}`, `mysql:${MYSQL_VERSION:-8.0}` |
| **UI port** | 8080, on service `movary` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Movary** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `tmdb_api_key` |  |
| `mysql_password` | *random password, 32 characters* |
| `mysql_root_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MOVARY_VERSION` | latest |
| `MYSQL_VERSION` | 8.0 |
| `TMDB_API_KEY` | ${tmdb_api_key} |
| `MYSQL_PASSWORD` | ${mysql_password} |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `APP_URL` | http://${main_domain} |
| `APP_ENV` | production |

## Domains

| Service | Port | Host |
|---|---|---|
| `movary` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  movary:
    image: leepeuker/movary:${MOVARY_VERSION:-latest}
    restart: unless-stopped
    ports:
      - "8080"
    environment:
      # TMDB API configuration
      TMDB_API_KEY: ${TMDB_API_KEY}
      # Database configuration
      DATABASE_MODE: "mysql"
      DATABASE_MYSQL_HOST: "mysql"
      DATABASE_MYSQL_NAME: "movary"
      DATABASE_MYSQL_USER: "movary_user"
      DATABASE_MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      # Application settings
      APP_URL: ${APP_URL:-http://localhost:8080}
      APP_ENV: ${APP_ENV:-production}
    volumes:
      - movary_storage:/app/storage
    depends_on:
      - mysql

  mysql:
    image: mysql:${MYSQL_VERSION:-8.0}
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: "movary"
      MYSQL_USER: "movary_user"
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      # MySQL optimization
      MYSQL_INNODB_BUFFER_POOL_SIZE: "128M"
      MYSQL_INNODB_LOG_FILE_SIZE: "64M"
    volumes:
      - movary_db:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

volumes:
  movary_db:
  movary_storage:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
