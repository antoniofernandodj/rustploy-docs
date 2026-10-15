---
title: Host Affine Pro with Rustploy
description: "Collaborative note-taking and project management platform (Notion/Miro style). Create Affine Pro in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Affine Pro**: Collaborative note-taking and project management platform (Notion/Miro style). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `affinepro` |
| **Containers** | 4 (`affinepro`, `migration`, `db`, `redis`) |
| **Images** | `ghcr.io/toeverything/affine-graphql:stable-780dd83`, `postgres:15-alpine`, `redis:7-alpine` |
| **UI port** | 3010, on service `affinepro` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Affine Pro** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 16 characters* |
| `redis_password` | *random password, 16 characters* |
| `mailer_host` |  |
| `mailer_port` | 587 |
| `mailer_user` |  |
| `mailer_password` |  |
| `mailer_sender` |  |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `MAILER_HOST` | ${mailer_host} |
| `MAILER_PORT` | ${mailer_port} |
| `MAILER_USER` | ${mailer_user} |
| `MAILER_PASSWORD` | ${mailer_password} |
| `MAILER_SENDER` | ${mailer_sender} |

## Domains

| Service | Port | Host |
|---|---|---|
| `affinepro` | 3010 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  affinepro:
    image: ghcr.io/toeverything/affine-graphql:stable-780dd83
    restart: unless-stopped
    ports:
      - 3010
    volumes:
      - affine-storage:/root/.affine/storage
      - affine-config:/root/.affine/config
    environment:
      - REDIS_SERVER_HOST=redis
      - REDIS_SERVER_PASSWORD=${REDIS_PASSWORD}
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/affinepro
      - AFFINE_SERVER_HOST=${DOMAIN}
      - MAILER_HOST=${MAILER_HOST}
      - MAILER_PORT=${MAILER_PORT}
      - MAILER_USER=${MAILER_USER}
      - MAILER_PASSWORD=${MAILER_PASSWORD}
      - MAILER_SENDER=${MAILER_SENDER}
    depends_on:
      - db
      - redis

  migration:
    image: ghcr.io/toeverything/affine-graphql:stable-780dd83
    command: node ./scripts/self-host-predeploy.js
    environment:
      - REDIS_SERVER_HOST=redis
      - REDIS_SERVER_PASSWORD=${REDIS_PASSWORD}
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/affinepro
      - AFFINE_SERVER_HOST=${DOMAIN}
      - MAILER_HOST=${MAILER_HOST}
      - MAILER_PORT=${MAILER_PORT}
      - MAILER_USER=${MAILER_USER}
      - MAILER_PASSWORD=${MAILER_PASSWORD}
      - MAILER_SENDER=${MAILER_SENDER}
    volumes:
      - affine-storage:/root/.affine/storage
      - affine-config:/root/.affine/config
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=affinepro
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data

volumes:
  affine-storage: {}
  affine-config: {}
  postgres-data: {}
  redis-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
