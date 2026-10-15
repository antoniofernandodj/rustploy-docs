---
title: Host Notifuse with Rustploy
description: "Open-source hub for creating, sending and tracking newsletter metrics. Create Notifuse in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Notifuse**: Open-source hub for creating, sending and tracking newsletter metrics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `notifuse` |
| **Containers** | 2 (`db`, `notifuse`) |
| **Images** | `postgres:17-alpine`, `notifuse/notifuse:latest` |
| **UI port** | 8080, on service `notifuse` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Notifuse** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random base64 key (64 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ROOT_EMAIL` | *generated email* |
| `API_ENDPOINT` | https://${main_domain} |
| `SECRET_KEY` | ${secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `notifuse` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  notifuse:
    image: notifuse/notifuse:latest
    restart: unless-stopped
    depends_on:
      - db
    environment:
      # Root user configuration
      ROOT_EMAIL: ${ROOT_EMAIL}

      # API configuration
      API_ENDPOINT: ${API_ENDPOINT}

      # Database configuration
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_PREFIX: notifuse
      DB_NAME: postgres
      DB_SSLMODE: disable

      # Secret key for authentication (auto-generated)
      SECRET_KEY: ${SECRET_KEY}

      # Server configuration
      SERVER_PORT: 8080
      SERVER_HOST: 0.0.0.0
      ENVIRONMENT: production
    volumes:
      - notifuse_data:/app/data
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/healthz"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

volumes:
  db_data: {}
  notifuse_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
