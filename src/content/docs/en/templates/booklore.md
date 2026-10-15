---
title: Host Booklore with Rustploy
description: "MariaDB-based application for managing book-related data. Create Booklore in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Booklore**: MariaDB-based application for managing book-related data. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `booklore` |
| **Containers** | 2 (`booklore`, `mariadb`) |
| **Images** | `ghcr.io/booklore-app/booklore:${BOOKLORE_IMAGE_TAG}`, `lscr.io/linuxserver/mariadb:latest` |
| **UI port** | 6060, on service `booklore` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Booklore** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `app_password` | *random password, 32 characters* |
| `db_root_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BOOKLORE_IMAGE_TAG` | latest |
| `PUID` | 1000 |
| `PGID` | 1000 |
| `TZ` | Etc/UTC |
| `MYSQL_DATABASE` | booklore |
| `MYSQL_USER` | booklore |
| `MYSQL_PASSWORD` | ${app_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `booklore` | 6060 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  booklore:
    image: ghcr.io/booklore-app/booklore:${BOOKLORE_IMAGE_TAG}
    environment:
      - DATABASE_URL=jdbc:mariadb://mariadb:3306/${MYSQL_DATABASE}
      - DATABASE_USERNAME=${MYSQL_USER}
      - DATABASE_PASSWORD=${MYSQL_PASSWORD}
    depends_on:
      mariadb:
        condition: service_healthy
    ports:
      - 6060
    volumes:
      - booklore-data:/app/data
      - booklore-books:/books

  mariadb:
    image: lscr.io/linuxserver/mariadb:latest
    environment:
      - PUID=${PUID}
      - PGID=${PGID}
      - TZ=${TZ}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mariadb-config:/config
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  booklore-data: {}
  booklore-books: {}
  mariadb-config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
