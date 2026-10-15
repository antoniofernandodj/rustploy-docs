---
title: Host Bugsink with Rustploy
description: "Self-hosted software error tracker compatible with the Sentry SDK. Create Bugsink in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Bugsink**: Self-hosted software error tracker compatible with the Sentry SDK. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bugsink` |
| **Containers** | 2 (`db`, `web`) |
| **Images** | `postgres:17-alpine`, `bugsink/bugsink:latest` |
| **UI port** | 8000, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Bugsink** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_user` | bugsinkuser |
| `postgres_password` | *random password, 32 characters* |
| `postgres_db` | bugsink |
| `secret_key` | *random password, 64 characters* |
| `superuser` | admin:admin |
| `behind_https_proxy` | false |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |
| `SECRET_KEY` | ${secret_key} |
| `CREATE_SUPERUSER` | ${superuser} |
| `BEHIND_HTTPS_PROXY` | ${behind_https_proxy} |
| `BASE_URL` | https://${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -h db"]
      retries: 5
      start_period: 10s
      interval: 5s
      timeout: 5s

  web:
    image: bugsink/bugsink:latest
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    expose:
      - 8000
    environment:
      SECRET_KEY: ${SECRET_KEY}
      CREATE_SUPERUSER: ${CREATE_SUPERUSER}
      PORT: 8000
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      BEHIND_HTTPS_PROXY: ${BEHIND_HTTPS_PROXY}
      BASE_URL: ${BASE_URL}
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'python -c ''import requests; requests.get("http://localhost:8000/").raise_for_status()''',
        ]
      interval: 5s
      timeout: 20s
      retries: 10

volumes:
  db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
