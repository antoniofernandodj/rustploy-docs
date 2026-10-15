---
title: Host N8n With Postgres with Rustploy
description: "N8n With Postgres application. Create N8n With Postgres in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**N8n With Postgres**: N8n With Postgres application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `n8n-with-postgres` |
| **Containers** | 2 (`postgres`, `n8n`) |
| **Images** | `postgres:17-alpine`, `n8nio/n8n:latest` |
| **UI port** | 5678, on service `n8n` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **N8n With Postgres** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_user` | *generated username* |
| `postgres_password` | *random password, 24 characters* |
| `postgres_db` | n8n |
| `n8n_encryption_key` | *random base64 key (64 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `N8N_HOST` | ${main_domain} |
| `N8N_PORT` | 5678 |
| `GENERIC_TIMEZONE` | Europe/Berlin |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |
| `N8N_ENCRYPTION_KEY` | ${n8n_encryption_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `n8n` | 5678 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      start_period: 30s
      interval: 10s
      timeout: 5s
      retries: 5

  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    environment:
      # Configuration PostgreSQL
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      
      # SÉCURITÉ - Encryption (IMPORTANT)
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      
      # Configuration réseau
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=https://${N8N_HOST}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_SECURE_COOKIE=false
      
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  n8n_data:
  postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
