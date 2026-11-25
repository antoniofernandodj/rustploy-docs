---
title: Host BookStack with Rustploy
description: "Wiki platform for corporate documentation and manuals. Create BookStack in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**BookStack**: Wiki platform for corporate documentation and manuals. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bookstack` |
| **Containers** | 2 (`bookstack`, `bookstack-db`) |
| **Images** | `lscr.io/linuxserver/bookstack:24.12.1`, `mariadb:10.11` |
| **UI port** | 80, on service `bookstack` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **BookStack** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |
| `app_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |
| `APP_KEY` | ${app_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `bookstack` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  bookstack:
    image: lscr.io/linuxserver/bookstack:24.12.1
    restart: unless-stopped
    ports:
      - 80
    environment:
      - PUID=1000
      - PGID=1000
      - APP_URL=http://${DOMAIN}
      - DB_HOST=bookstack-db
      - DB_USERNAME=mariadb
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=bookstack
      - APP_KEY=${APP_KEY}
    volumes:
      - config:/config
    depends_on:
      - bookstack-db

  bookstack-db:
    image: mariadb:10.11
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=bookstack
      - MYSQL_USER=mariadb
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql

volumes:
  config: {}
  db_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
