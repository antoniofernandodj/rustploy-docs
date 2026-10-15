---
title: Host Pterodactyl with Rustploy
description: "Advanced, robust panel for managing large numbers of game servers in Docker. Create Pterodactyl in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Pterodactyl**: Advanced, robust panel for managing large numbers of game servers in Docker. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pterodactyl` |
| **Containers** | 3 (`database`, `cache`, `panel`) |
| **Images** | `mariadb:10.5`, `redis:alpine`, `ghcr.io/pterodactyl/panel:latest` |
| **UI port** | 80, on service `panel` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Pterodactyl** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `db_root_password` | *random password, 32 characters* |
| `secret_key` | *random base64 key (48 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `Domain` | ${main_domain} |
| `APP_URL` | {$main_domain} |
| `APP_TIMEZONE` | UTC |
| `APP_SERVICE_AUTHOR` | noreply@example.com |
| `MAIL_FROM` | noreply@example.com |
| `MAIL_DRIVER` | smtp |
| `MAIL_HOST` | mail |
| `MAIL_PORT` | 1025 |
| `MAIL_USERNAME` |  |
| `MAIL_PASSWORD` |  |
| `MAIL_ENCRYPTION` | true |
| `MYSQL_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |
| `DB_PORT` | 3306 |
| `CACHE_DRIVER` | redis |
| `SESSION_DRIVER` | redis |
| `QUEUE_DRIVER` | redis |
| `REDIS_HOST` | cache |
| `DB_HOST` | database |

## Domains

| Service | Port | Host |
|---|---|---|
| `panel` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  database:
    image: mariadb:10.5
    restart: always
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - "pterodb:/var/lib/mysql"
    environment:
      MYSQL_DATABASE: "panel"
      MYSQL_USER: "pterodactyl"
      MYSQL_PASSWORD:
      MYSQL_ROOT_PASSWORD:
  cache:
    image: redis:alpine
    restart: always
  panel:
    image: ghcr.io/pterodactyl/panel:latest
    restart: always
    links:
      - database
      - cache
    volumes:
      - "pterovar:/app/var/"
      - "pteronginx:/etc/nginx/http.d/"
      - "pterocerts:/etc/letsencrypt/"
      - "pterologs:/app/storage/logs"
    environment:
      APP_ENV: "production"
      APP_ENVIRONMENT_ONLY: "false"
      CACHE_DRIVER:
      SESSION_DRIVER:
      QUEUE_DRIVER:
      REDIS_HOST:
      DB_HOST:
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_PORT:
      MYSQL_PASSWORD:
      MYSQL_ROOT_PASSWORD:
      DB_CONNECTION: "mysql"

networks:
  default:
    ipam:
      config:
        - subnet: 172.20.0.0/16

volumes:
  pterodb:
  pterovar:
  pteronginx:
  pterocerts:
  pterologs:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
