---
title: Host Plausible with Rustploy
description: "Lightweight, cookie-free web traffic analyzer focused on user privacy. Create Plausible in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Plausible**: Lightweight, cookie-free web traffic analyzer focused on user privacy. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `plausible` |
| **Containers** | 3 (`plausible_db`, `plausible_events_db`, `plausible`) |
| **Images** | `postgres:16-alpine`, `clickhouse/clickhouse-server:24.3.3.102-alpine`, `ghcr.io/plausible/community-edition:v2.1.5` |
| **UI port** | 8000, on service `plausible` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Plausible** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_base` | *random base64 key (64 bytes)* |
| `totp_key` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BASE_URL` | http://${main_domain} |
| `SECRET_KEY_BASE` | ${secret_base} |
| `TOTP_VAULT_KEY` | ${totp_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `plausible` | 8000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/clickhouse/clickhouse-config.xml`
- `/clickhouse/clickhouse-user-config.xml`

## The template docker-compose.yml

```yaml
services:
  plausible_db:
    image: postgres:16-alpine
    restart: always

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres

  plausible_events_db:
    image: clickhouse/clickhouse-server:24.3.3.102-alpine
    restart: always

    volumes:
      - event-data:/var/lib/clickhouse
      - event-logs:/var/log/clickhouse-server
      - ../files/clickhouse/clickhouse-config.xml:/etc/clickhouse-server/config.d/logging.xml:ro
      - ../files/clickhouse/clickhouse-user-config.xml:/etc/clickhouse-server/users.d/logging.xml:ro
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

  plausible:
    image: ghcr.io/plausible/community-edition:v2.1.5
    restart: always
    command: sh -c "sleep 10 && /entrypoint.sh db createdb && /entrypoint.sh db migrate && /entrypoint.sh run"
    depends_on:
      - plausible_db
      - plausible_events_db
    env_file:
      - .env

volumes:
  db-data:
    driver: local
  event-data:
    driver: local
  event-logs:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
