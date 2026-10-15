---
title: Host Aptabase with Rustploy
description: "Self-hosted platform for web traffic analytics. Create Aptabase in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Aptabase**: Self-hosted platform for web traffic analytics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `aptabase` |
| **Containers** | 3 (`aptabase_db`, `aptabase_events_db`, `aptabase`) |
| **Images** | `postgres:15-alpine`, `clickhouse/clickhouse-server:23.8.16.16-alpine`, `ghcr.io/aptabase/aptabase:main` |
| **UI port** | 8080, on service `aptabase` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Aptabase** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `auth_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APTABASE_HOST` | ${main_domain} |
| `AUTH_SECRET` | ${auth_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `aptabase` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  aptabase_db:
    image: postgres:15-alpine
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: aptabase
      POSTGRES_PASSWORD: sTr0NGp4ssw0rd

    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aptabase"]
      interval: 10s
      timeout: 5s
      retries: 5

  aptabase_events_db:
    image: clickhouse/clickhouse-server:23.8.16.16-alpine
    restart: always
    volumes:
      - events-db-data:/var/lib/clickhouse
    environment:
      CLICKHOUSE_USER: aptabase
      CLICKHOUSE_PASSWORD: sTr0NGp4ssw0rd
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8123 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  aptabase:
    image: ghcr.io/aptabase/aptabase:main
    restart: always
    environment:
      BASE_URL: http://${APTABASE_HOST}
      AUTH_SECRET: ${AUTH_SECRET}
      DATABASE_URL: Server=aptabase_db;Port=5432;User Id=aptabase;Password=sTr0NGp4ssw0rd;Database=aptabase
      CLICKHOUSE_URL: Host=aptabase_events_db;Port=8123;Username=aptabase;Password=sTr0NGp4ssw0rd

volumes:
  db-data:
    driver: local
  events-db-data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
