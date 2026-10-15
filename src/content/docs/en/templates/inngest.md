---
title: Host Inngest with Rustploy
description: "Engine for orchestrating and running event-driven serverless workflows. Create Inngest in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Inngest**: Engine for orchestrating and running event-driven serverless workflows. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `inngest` |
| **Containers** | 3 (`inngest`, `postgres`, `redis`) |
| **Images** | `inngest/inngest:v1.12.1`, `postgres:16-alpine`, `redis:7-alpine` |
| **UI port** | 8288, on service `inngest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Inngest** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `event_key` | *generated JWT* |
| `signing_key` | *generated JWT* |
| `postgres_password` | *random password, 24 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `INNGEST_EVENT_KEY` | ${event_key} |
| `INNGEST_SIGNING_KEY` | ${signing_key} |
| `INNGEST_POSTGRES_URI` | postgresql://inngest:${postgres_password}@postgres:5432/inngest?sslmode=disable |
| `POSTGRES_DB` | inngest |
| `POSTGRES_USER` | inngest |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `INNGEST_REDIS_URI` | redis://redis:6379 |
| `INNGEST_POLL_INTERVAL` | 60 |
| `INNGEST_QUEUE_WORKERS` | 100 |
| `INNGEST_RETRY_INTERVAL` | 1 |
| `INNGEST_TICK` | 150 |
| `INNGEST_LOG_LEVEL` | info |
| `INNGEST_JSON` | true |
| `INNGEST_VERBOSE` | false |

## Domains

| Service | Port | Host |
|---|---|---|
| `inngest` | 8288 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  inngest:
    image: inngest/inngest:v1.12.1
    restart: unless-stopped
    command: >
      inngest start
      --host 0.0.0.0
      --port 8288
      --event-key ${INNGEST_EVENT_KEY}
      --signing-key ${INNGEST_SIGNING_KEY}
      --postgres-uri ${INNGEST_POSTGRES_URI}
      --redis-uri ${INNGEST_REDIS_URI}
      --poll-interval ${INNGEST_POLL_INTERVAL:-60}
      --queue-workers ${INNGEST_QUEUE_WORKERS:-100}
    environment:
      # Core Configuration
      - INNGEST_PORT=8288
      - INNGEST_HOST=0.0.0.0
      - INNGEST_EVENT_KEY=${INNGEST_EVENT_KEY}
      - INNGEST_SIGNING_KEY=${INNGEST_SIGNING_KEY}

      # Database & Cache
      - INNGEST_POSTGRES_URI=${INNGEST_POSTGRES_URI}
      - INNGEST_REDIS_URI=${INNGEST_REDIS_URI}

      # Performance Tuning
      - INNGEST_POLL_INTERVAL=${INNGEST_POLL_INTERVAL:-60}
      - INNGEST_QUEUE_WORKERS=${INNGEST_QUEUE_WORKERS:-100}
      - INNGEST_RETRY_INTERVAL=${INNGEST_RETRY_INTERVAL:-1}
      - INNGEST_TICK=${INNGEST_TICK:-150}

      # Logging
      - INNGEST_LOG_LEVEL=${INNGEST_LOG_LEVEL:-info}
      - INNGEST_JSON=${INNGEST_JSON:-false}
      - INNGEST_VERBOSE=${INNGEST_VERBOSE:-false}
    ports:
      - 8288
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - inngest_data:/home/inngest/.inngest
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8288/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
      - PGUSER=${POSTGRES_USER}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - 5432
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru --save 60 1000
    sysctls:
      - net.core.somaxconn=1024
    volumes:
      - redis_data:/data
    ports:
      - 6379
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  inngest_data:
  postgres_data:
  redis_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
