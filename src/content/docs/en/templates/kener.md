---
title: Host Kener with Rustploy
description: "Modern open-source status page for infrastructure monitoring. Create Kener in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Kener**: Modern open-source status page for infrastructure monitoring. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kener` |
| **Containers** | 3 (`kener`, `postgres`, `mysql`) |
| **Images** | `rajnandan1/kener:latest`, `postgres:alpine`, `mariadb:11` |
| **UI port** | 3000, on service `kener` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Kener** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `KENER_SECRET_KEY` | *random password, 64 characters* |
| `POSTGRES_PASSWORD` | *random password, 32 characters* |
| `MYSQL_PASSWORD` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TZ` | Etc/UTC |
| `KENER_SECRET_KEY` | ${KENER_SECRET_KEY} |
| `DATABASE_URL` | sqlite://./database/kener.sqlite.db |
| `KENER_BASE_PATH` |  |
| `ORIGIN` | http://localhost:3000 |
| `RESEND_API_KEY` |  |
| `RESEND_SENDER_EMAIL` | Accounts <accounts@resend.dev> |
| `POSTGRES_USER` | user |
| `POSTGRES_DB` | kener_db |
| `MYSQL_USER` | user |
| `MYSQL_DATABASE` | kener_db |
| `MYSQL_RANDOM_ROOT_PASSWORD` | true |
| `MYSQL_PASSWORD` | ${MYSQL_PASSWORD} |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `kener` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  kener:
    image: rajnandan1/kener:latest
    environment:
      - TZ=${TZ}
      - KENER_SECRET_KEY=${KENER_SECRET_KEY} # 🔐 API key / secret
      - DATABASE_URL=${DATABASE_URL}
      - KENER_BASE_PATH=${KENER_BASE_PATH}
      - ORIGIN=${ORIGIN}
      - RESEND_API_KEY=${RESEND_API_KEY} # 🔐 API key
      - RESEND_SENDER_EMAIL=${RESEND_SENDER_EMAIL}
    ports:
      - 3000
    volumes:
      - kener_db:/app/database
      - ../files/uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:alpine
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD} # 🔐 DB password
      - POSTGRES_DB=${POSTGRES_DB}
    restart: unless-stopped

  mysql:
    image: mariadb:11
    environment:
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD} # 🔐 DB password
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_RANDOM_ROOT_PASSWORD=true
    restart: unless-stopped

volumes:
  kener_db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
