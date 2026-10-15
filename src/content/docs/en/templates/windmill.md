---
title: Host Windmill with Rustploy
description: "Platform for developers to build robust internal workflows from scripts (Retool alternative). Create Windmill in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Windmill**: Platform for developers to build robust internal workflows from scripts (Retool alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `windmill` |
| **Containers** | 6 (`windmill-postgres`, `windmill-server`, `windmill-worker`, `windmill-worker-native`, `windmill-lsp`, `windmill-caddy`) |
| **Images** | `postgres:16`, `ghcr.io/windmill-labs/windmill:main`, `ghcr.io/windmill-labs/windmill-lsp:latest`, `ghcr.io/windmill-labs/caddy-l4:latest` |
| **UI port** | 80, on service `windmill-caddy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Windmill** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `WINDMILL_HOST` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `DATABASE_URL` | postgres://postgres:${postgres_password}@windmill-postgres/windmill?sslmode=disable |

## Domains

| Service | Port | Host |
|---|---|---|
| `windmill-caddy` | 80 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `Caddyfile`

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  windmill-postgres:
    image: postgres:16
    shm_size: 1g
    restart: unless-stopped
    volumes:
      - windmill-postgres-data:/var/lib/postgresql/data

    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: windmill
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  windmill-server:
    image: ghcr.io/windmill-labs/windmill:main

    restart: unless-stopped
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MODE=server
      - BASE_URL=http://${WINDMILL_HOST}
    depends_on:
      windmill-postgres:
        condition: service_healthy
    volumes:
      - windmill-worker-logs:/tmp/windmill/logs

  windmill-worker:
    image: ghcr.io/windmill-labs/windmill:main
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "1"
          memory: 2048M
    restart: unless-stopped

    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MODE=worker
      - WORKER_GROUP=default
    depends_on:
      windmill-postgres:
        condition: service_healthy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - windmill-worker-cache:/tmp/windmill/cache
      - windmill-worker-logs:/tmp/windmill/logs

  windmill-worker-native:
    image: ghcr.io/windmill-labs/windmill:main
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: "0.1"
          memory: 128M
    restart: unless-stopped

    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MODE=worker
      - WORKER_GROUP=native
      - NUM_WORKERS=8
      - SLEEP_QUEUE=200
    depends_on:
      windmill-postgres:
        condition: service_healthy
    volumes:
      - windmill-worker-logs:/tmp/windmill/logs

  windmill-lsp:
    image: ghcr.io/windmill-labs/windmill-lsp:latest
    restart: unless-stopped

    volumes:
      - windmill-lsp-cache:/root/.cache

  windmill-caddy:
    image: ghcr.io/windmill-labs/caddy-l4:latest
    restart: unless-stopped

    volumes:
      - ../files/Caddyfile:/etc/caddy/Caddyfile
    environment:
      - BASE_URL=":80"
    depends_on:
      - windmill-server
      - windmill-lsp


volumes:
  windmill-postgres-data:
  windmill-worker-cache:
  windmill-worker-logs:
  windmill-lsp-cache:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
