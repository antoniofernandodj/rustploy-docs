---
title: Host Unleash with Rustploy
description: "Robust enterprise platform for managing feature flags and rollout strategies. Create Unleash in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Unleash**: Robust enterprise platform for managing feature flags and rollout strategies. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `unleash` |
| **Containers** | 2 (`unleash`, `db`) |
| **Images** | `unleashorg/unleash-server:7.4.0`, `postgres:15` |
| **UI port** | 4242, on service `unleash` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Unleash** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_name` | unleash |
| `db_user` | unleash |
| `db_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `unleash` | 4242 | ${main_domain} |

## The template docker-compose.yml

```yaml
# The default users credentials are:
# Login: admin
# Password: unleash4all
# It is highly recommended to change the password after first login.
# More info: https://github.com/Unleash/unleash?tab=readme-ov-file#unleash-open-source
version: "3.8"

services:
  unleash:
    image: unleashorg/unleash-server:7.4.0
    restart: unless-stopped
    environment:
      DATABASE_URL: "postgres://${DB_USER}:${DB_PASSWORD}@db/${DB_NAME}"
      DATABASE_SSL: "false"
      LOG_LEVEL: "warn"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: wget --no-verbose --tries=1 --spider http://localhost:4242/health || exit 1
      interval: 1s
      timeout: 1m
      retries: 5
      start_period: 15s
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_DB: "${DB_NAME}"
      POSTGRES_USER: "${DB_USER}"
      POSTGRES_PASSWORD: "${DB_PASSWORD}"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test:
        [
          "CMD",
          "pg_isready",
          "--username=${DB_USER}",
          "--host=127.0.0.1",
          "--port=5432",
        ]
      interval: 2s
      timeout: 1m
      retries: 5
      start_period: 10s

volumes:
  db_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
