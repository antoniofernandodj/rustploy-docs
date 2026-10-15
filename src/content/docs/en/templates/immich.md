---
title: Host Immich with Rustploy
description: "High-performance backup server for phone photos and videos. Create Immich in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Immich**: High-performance backup server for phone photos and videos. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `immich` |
| **Containers** | 4 (`immich-server`, `immich-machine-learning`, `immich-redis`, `immich-database`) |
| **Images** | `ghcr.io/immich-app/immich-server:v2.1.0`, `ghcr.io/immich-app/immich-machine-learning:v2.1.0`, `redis:6.2-alpine`, `tensorchord/pgvecto-rs:pg14-v0.3.0` |
| **UI port** | 2283, on service `immich-server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Immich** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password* |
| `db_user` | immich |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `IMMICH_HOST` | ${main_domain} |
| `SERVER_URL` | https://${main_domain} |
| `FRONT_BASE_URL` | https://${main_domain} |
| `DB_HOSTNAME` | immich-database |
| `DB_PORT` | 5432 |
| `DB_USERNAME` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_DATABASE_NAME` | immich |
| `REDIS_HOSTNAME` | immich-redis |
| `REDIS_PORT` | 6379 |
| `REDIS_DBINDEX` | 0 |
| `TZ` | UTC |

## Domains

| Service | Port | Host |
|---|---|---|
| `immich-server` | 2283 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.9"

services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:v2.1.0

    volumes:
      - immich-library:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      immich-redis:
        condition: service_healthy
      immich-database:
        condition: service_healthy
    environment:
      PORT: 2283
      SERVER_URL: ${SERVER_URL}
      FRONT_BASE_URL: ${FRONT_BASE_URL}
      # Database Configuration
      DB_HOSTNAME: ${DB_HOSTNAME}
      DB_PORT: ${DB_PORT}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE_NAME: ${DB_DATABASE_NAME}
      # Redis Configuration
      REDIS_HOSTNAME: ${REDIS_HOSTNAME}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_DBINDEX: ${REDIS_DBINDEX}
      # Server Configuration
      TZ: ${TZ}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:2283/server-info/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  immich-machine-learning:
    image: ghcr.io/immich-app/immich-machine-learning:v2.1.0

    volumes:
      - immich-model-cache:/cache
    environment:
      REDIS_HOSTNAME: ${REDIS_HOSTNAME}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_DBINDEX: ${REDIS_DBINDEX}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  immich-redis:
    image: redis:6.2-alpine

    volumes:
      - immich-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  immich-database:
    image: tensorchord/pgvecto-rs:pg14-v0.3.0

    volumes:
      - immich-postgres:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_DB: immich
      POSTGRES_INITDB_ARGS: '--data-checksums'
    healthcheck:
      test: pg_isready -U ${DB_USERNAME} -d immich || exit 1
      interval: 10s
      timeout: 5s
      retries: 5
    command:
      [
        'postgres',
        '-c',
        'shared_preload_libraries=vectors.so',
        '-c',
        'search_path="$$user", public, vectors',
        '-c',
        'logging_collector=on',
        '-c',
        'max_wal_size=2GB',
        '-c',
        'shared_buffers=512MB',
        '-c',
        'wal_compression=on',
      ]
    restart: always

volumes:
  immich-model-cache:
  immich-postgres:
  immich-library:
  immich-redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
