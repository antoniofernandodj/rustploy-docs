---
title: Host Budget Board with Rustploy
description: "Financial budgeting app with a PostgreSQL backend. Create Budget Board in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Budget Board**: Financial budgeting app with a PostgreSQL backend. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `budget-board` |
| **Containers** | 3 (`budget-board-server`, `budget-board-client`, `budget-board-db`) |
| **Images** | `ghcr.io/teelur/budget-board/server:release`, `ghcr.io/teelur/budget-board/client:release`, `postgres:16` |
| **UI port** | 6253, on service `budget-board-client` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Budget Board** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `budget-board-client` | 6253 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  budget-board-server:
    restart: unless-stopped
    image: ghcr.io/teelur/budget-board/server:release

    environment:
      Logging__LogLevel__Default: Information
      CLIENT_URL: http://budget-board-client:6253
      POSTGRES_HOST: budget-board-db
      POSTGRES_DATABASE: budgetboard
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      AUTO_UPDATE_DB: true

    depends_on:
      budget-board-db:
        condition: service_healthy
  budget-board-client:
    restart: unless-stopped
    image: ghcr.io/teelur/budget-board/client:release
    environment:
      VITE_API_URL: http://budget-board-server
      PORT: 6253
    ports:
      - 6253
    depends_on:
      - budget-board-server
  budget-board-db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: budgetboard
    volumes:
      - "../files/db-data:/var/lib/postgresql/data"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d budgetboard"]
      interval: 5s
      timeout: 5s
      retries: 5
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
