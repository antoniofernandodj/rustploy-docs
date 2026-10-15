---
title: Host Etherpad with Rustploy
description: "Real-time collaborative multi-user text editor. Create Etherpad in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Etherpad**: Real-time collaborative multi-user text editor. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `etherpad` |
| **Containers** | 2 (`app`, `postgres`) |
| **Images** | `etherpad/etherpad:latest`, `postgres:15-alpine` |
| **UI port** | 9001, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Etherpad** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_password` | *random password, 32 characters* |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NODE_ENV` | production |
| `ADMIN_PASSWORD` | ${admin_password} |
| `DB_CHARSET` | utf8mb4 |
| `DB_HOST` | postgres |
| `DB_NAME` | etherpad |
| `DB_PASS` | ${postgres_password} |
| `DB_PORT` | 5432 |
| `DB_TYPE` | postgres |
| `DB_USER` | admin |
| `DEFAULT_PAD_TEXT` |   |
| `DISABLE_IP_LOGGING` | false |
| `SOFFICE` | null |
| `TRUST_PROXY` | true |
| `POSTGRES_DB` | etherpad |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_USER` | admin |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 9001 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  app:
    user: "0:0"
    image: etherpad/etherpad:latest
    tty: true
    stdin_open: true
    volumes:
      - ../files/plugins:/opt/etherpad-lite/src/plugin_packages
      - ../files/etherpad_var:/opt/etherpad-lite/var
    depends_on:
      - postgres
    environment:
      NODE_ENV: ${NODE_ENV}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      DB_CHARSET: ${DB_CHARSET}
      DB_HOST: ${DB_HOST}
      DB_NAME: ${DB_NAME}
      DB_PASS: ${DB_PASS}
      DB_PORT: ${DB_PORT}
      DB_TYPE: ${DB_TYPE}
      DB_USER: ${DB_USER}
      DEFAULT_PAD_TEXT: ${DEFAULT_PAD_TEXT}
      DISABLE_IP_LOGGING: ${DISABLE_IP_LOGGING}
      SOFFICE: ${SOFFICE}
      TRUST_PROXY: ${TRUST_PROXY}
    restart: always
    expose:
      - 9001
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      PGDATA: /var/lib/postgresql/data/pgdata
    restart: always
    volumes:
      - ../files/postgres_data:/var/lib/postgresql/data/pgdata
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
