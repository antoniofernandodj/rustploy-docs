---
title: Host Authorizer with Rustploy
description: "Low-code solution for user authentication and authorization. Create Authorizer in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Authorizer**: Low-code solution for user authentication and authorization. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `authorizer` |
| **Containers** | 3 (`authorizer`, `authorizer-db`, `authorizer-redis`) |
| **Images** | `lakhansamani/authorizer:1.4.4`, `postgres:15-alpine`, `redis:7-alpine` |
| **UI port** | 8080, on service `authorizer` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Authorizer** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |
| `admin_secret` | *random password, 32 characters* |
| `jwt_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `ADMIN_SECRET` | ${admin_secret} |
| `JWT_SECRET` | *generated JWT* |

## Domains

| Service | Port | Host |
|---|---|---|
| `authorizer` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  authorizer:
    image: lakhansamani/authorizer:1.4.4
    restart: unless-stopped
    ports:
      - 8080
    environment:
      - DATABASE_TYPE=postgres
      - DATABASE_URL=postgres://postgres:${DB_PASSWORD}@authorizer-db:5432/authorizer?sslmode=disable
      - REDIS_URL=redis://authorizer-redis:6379
      - ADMIN_SECRET=${ADMIN_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - COOKIE_NAME=authorizer
      - ACCESS_TOKEN_EXPIRY_TIME=86400
      - REFRESH_TOKEN_EXPIRY_TIME=86400
      - DISABLE_PLAYGROUND=true
    depends_on:
      - authorizer-db
      - authorizer-redis

  authorizer-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=authorizer
    volumes:
      - db_data:/var/lib/postgresql/data

  authorizer-redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  db_data: {}
  redis_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
