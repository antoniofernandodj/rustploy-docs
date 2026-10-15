---
title: Host Libredesk with Rustploy
description: "Help desk and customer support hub packaged as a single binary. Create Libredesk in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Libredesk**: Help desk and customer support hub packaged as a single binary. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `libredesk` |
| **Containers** | 3 (`libredesk`, `db`, `redis`) |
| **Images** | `libredesk/libredesk:latest`, `postgres:17-alpine`, `redis:7-alpine` |
| **UI port** | 9000, on service `libredesk` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Libredesk** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `libredesk_domain` | *domain (generated; replace it with yours)* |
| `libredesk_system_user_password` | *random base64 key (32 bytes)* |
| `pg_username` | *generated username* |
| `pg_password` | *random password, 16 characters* |
| `pg_database` | libredesk |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LIBREDESK_SYSTEM_USER_PASSWORD` | ${libredesk_system_user_password} |
| `POSTGRES_USER` | ${pg_username} |
| `POSTGRES_PASSWORD` | ${pg_password} |
| `POSTGRES_DB` | ${pg_database} |

## Domains

| Service | Port | Host |
|---|---|---|
| `libredesk` | 9000 | ${libredesk_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `config.toml`

## The template docker-compose.yml

```yaml
services:
  libredesk:
    image: libredesk/libredesk:latest
    restart: unless-stopped
    ports:
      - 9000
    environment:
      # If the password is set during first docker-compose up, the system user password will be set to this value.
      # You can always set system user password later by running `docker exec -it libredesk_app ./libredesk --set-system-user-password`.
      LIBREDESK_SYSTEM_USER_PASSWORD: ${LIBREDESK_SYSTEM_USER_PASSWORD:-}
    depends_on:
      - db
      - redis
    volumes:
      - ../files/uploads:/libredesk/uploads:rw
      - ../files/config.toml:/libredesk/config.toml
    command: [ sh, -c, "./libredesk --install --idempotent-install --yes --config /libredesk/config.toml && ./libredesk --upgrade --yes --config /libredesk/config.toml && ./libredesk --config /libredesk/config.toml" ]

  # PostgreSQL database
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    ports:
      # Only bind on the local interface. To connect to Postgres externally, change this to 0.0.0.0
      - 5432
    environment:
      # Set these environment variables to configure the database, defaults to libredesk.
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-libredesk} -d ${POSTGRES_DB:-libredesk}" ]
      interval: 10s
      timeout: 5s
      retries: 6
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      # Only bind on the local interface.
      - 6379
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
