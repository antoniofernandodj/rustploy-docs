---
title: Host Mixpost with Rustploy
description: "Centralized platform for scheduling and automatically posting to social networks. Create Mixpost in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mixpost**: Centralized platform for scheduling and automatically posting to social networks. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mixpost` |
| **Containers** | 3 (`mixpost`, `mysql`, `redis`) |
| **Images** | `inovector/mixpost:latest`, `mysql/mysql-server:8.0`, `redis:latest` |
| **UI port** | 80, on service `mixpost` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mixpost** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `mx_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_NAME` | Mixpost |
| `APP_KEY` | base64:ygtEUxD0fB3vUchihbUYqUzN57rfNi9ER5alJ98dWiA= |
| `APP_DEBUG` | false |
| `APP_DOMAIN` | ${main_domain} |
| `APP_URL` | http://${APP_DOMAIN} |
| `DB_DATABASE` | mixpost_db |
| `DB_USERNAME` | mixpost_user |
| `DB_PASSWORD` | ${mx_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `mixpost` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
    mixpost:
        image: inovector/mixpost:latest
        environment:
            APP_NAME: ${APP_NAME}
            APP_KEY: ${APP_KEY}
            APP_DEBUG: ${APP_DEBUG}
            APP_DOMAIN: ${APP_DOMAIN}
            APP_URL: ${APP_URL}
            DB_DATABASE: ${DB_DATABASE}
            DB_USERNAME: ${DB_USERNAME}
            DB_PASSWORD: ${DB_PASSWORD}
        volumes:
            - storage:/var/www/html/storage/app
            - logs:/var/www/html/storage/logs
        depends_on:
            - mysql
            - redis 
        restart: unless-stopped
    mysql:
        image: 'mysql/mysql-server:8.0'
        environment:
            MYSQL_DATABASE: ${DB_DATABASE}
            MYSQL_USER: ${DB_USERNAME}
            MYSQL_PASSWORD: ${DB_PASSWORD}
        volumes:
            - 'mysql:/var/lib/mysql'
        healthcheck:
            test: ["CMD", "mysqladmin", "ping", "-p ${DB_PASSWORD}"]
            retries: 3
            timeout: 5s
        restart: unless-stopped
    redis:
        image: 'redis:latest'
        command: redis-server --appendonly yes --replica-read-only no
        volumes:
            - 'redis:/data'
        healthcheck:
            test: ["CMD", "redis-cli", "ping"]
            retries: 3
            timeout: 5s
        restart: unless-stopped  

volumes:
    mysql: {}
    redis: {}
    storage: {}
    logs: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
