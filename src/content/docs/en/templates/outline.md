---
title: Host Outline with Rustploy
description: "Modern, extremely clean corporate knowledge base for agile teams. Create Outline in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Outline**: Modern, extremely clean corporate knowledge base for agile teams. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `outline` |
| **Containers** | 4 (`outline`, `dex`, `postgres`, `redis`) |
| **Images** | `outlinewiki/outline:0.82.0`, `ghcr.io/dexidp/dex:v2.37.0`, `postgres:15`, `redis:latest` |
| **UI port** | 3000, on service `outline` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Outline** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `dex_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random hash* |
| `utils_secret` | *random base64 key (32 bytes)* |
| `client_secret` | *random base64 key (32 bytes)* |
| `postgres_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `URL` | http://${main_domain} |
| `DEX_URL` | http://${dex_domain} |
| `DOMAIN_NAME` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `SECRET_KEY` | ${secret_key} |
| `UTILS_SECRET` | ${utils_secret} |
| `CLIENT_SECRET` | ${client_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `outline` | 3000 | ${main_domain} |
| `dex` | 5556 | ${dex_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/etc/dex/config.yaml`

## The template docker-compose.yml

```yaml
services:
  outline:
    image: outlinewiki/outline:0.82.0
    restart: always
    depends_on:
      - postgres
      - redis
      - dex
    ports:
      - 3000
    environment:
      NODE_ENV: production
      URL: ${URL}
      FORCE_HTTPS: 'false'
      SECRET_KEY: ${SECRET_KEY}
      UTILS_SECRET: ${UTILS_SECRET}
      DATABASE_URL: postgres://outline:${POSTGRES_PASSWORD}@postgres:5432/outline
      PGSSLMODE: disable
      REDIS_URL: redis://redis:6379
      OIDC_CLIENT_ID: outline
      OIDC_CLIENT_SECRET: ${CLIENT_SECRET}
      OIDC_AUTH_URI: ${DEX_URL}/auth
      OIDC_TOKEN_URI: ${DEX_URL}/token
      OIDC_USERINFO_URI: ${DEX_URL}/userinfo

  dex:
    image: ghcr.io/dexidp/dex:v2.37.0
    restart: always
    volumes:
      - ../files/etc/dex/config.yaml:/etc/dex/config.yaml
    command:
      - dex
      - serve
      - /etc/dex/config.yaml
    ports:
      - 5556

  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: outline
      POSTGRES_USER: outline
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data-test-outline-khufpx:/var/lib/postgresql/data

  redis:
    image: redis:latest
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data-test-outline-khufpx:/data
    
volumes:
  postgres_data-test-outline-khufpx:
  redis_data-test-outline-khufpx:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
