---
title: Host Directus with Rustploy
description: "Headless CMS and instant API wrapper for SQL. Create Directus in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Directus**: Headless CMS and instant API wrapper for SQL. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `directus` |
| **Containers** | 3 (`database`, `cache`, `directus`) |
| **Images** | `postgis/postgis:13-master`, `redis:6`, `directus/directus:11.12.0` |
| **UI port** | 8055, on service `directus` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Directus** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `directus_secret` | *random base64 key (64 bytes)* |
| `database_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DATABASE_PASSWORD` | ${database_password} |
| `DIRECTUS_SECRET` | ${directus_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `directus` | 8055 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  database:
    image: postgis/postgis:13-master
    volumes:
      - directus_database:/var/lib/postgresql/data

    environment:
      POSTGRES_USER: "directus"
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: "directus"
    healthcheck:
      test: ["CMD", "pg_isready", "--host=localhost", "--username=directus"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s

  cache:
    image: redis:6
    healthcheck:
      test: ["CMD-SHELL", "[ $$(redis-cli ping) = 'PONG' ]"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s


  directus:
    image: directus/directus:11.12.0
    ports:
      - 8055
    volumes:
      - directus_uploads:/directus/uploads
      - directus_extensions:/directus/extensions
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_healthy
    environment:
      SECRET: ${DIRECTUS_SECRET}

      DB_CLIENT: "pg"
      DB_HOST: "database"
      DB_PORT: "5432"
      DB_DATABASE: "directus"
      DB_USER: "directus"
      DB_PASSWORD: ${DATABASE_PASSWORD}

      CACHE_ENABLED: "true"
      CACHE_AUTO_PURGE: "true"
      CACHE_STORE: "redis"
      REDIS: "redis://cache:6379"

      # After first successful login, remove the admin email/password env. variables below
      # as these will now be stored in the database.
      ADMIN_EMAIL: "admin@example.com"
      ADMIN_PASSWORD: "d1r3ctu5"
volumes:
  directus_uploads:
  directus_extensions:
  directus_database:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
