---
title: Host Triggerdotdev with Rustploy
description: "Triggerdotdev application. Create Triggerdotdev in one click on Rustploy: 6 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Triggerdotdev**: Triggerdotdev application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `triggerdotdev` |
| **Containers** | 6 (`webapp`, `postgres`, `redis`, `docker-provider`, `coordinator`, `electric`) |
| **Images** | `ghcr.io/triggerdotdev/trigger.dev:${TRIGGER_IMAGE_TAG:-v3}`, `postgres:${POSTGRES_IMAGE_TAG:-16}`, `redis:${REDIS_IMAGE_TAG:-7}`, `ghcr.io/triggerdotdev/provider/docker:${TRIGGER_IMAGE_TAG:-v3}`, `ghcr.io/triggerdotdev/coordinator:${TRIGGER_IMAGE_TAG:-v3}`, `electricsql/electric:${ELECTRIC_IMAGE_TAG:-latest}` |
| **UI port** | 3000, on service `webapp` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Triggerdotdev** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `magic_link_secret` | *random base64 key (16 bytes)* |
| `session_secret` | *random base64 key (16 bytes)* |
| `encryption_key` | *random base64 key (32 bytes)* |
| `provider_secret` | *random base64 key (32 bytes)* |
| `coordinator_secret` | *random base64 key (32 bytes)* |
| `db_password` | *random base64 key (24 bytes)* |
| `db_user` | triggeruser |
| `db_name` | triggerdb |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NODE_ENV` | production |
| `RUNTIME_PLATFORM` | docker-compose |
| `V3_ENABLED` | true |
| `TRIGGER_DOMAIN` | ${main_domain} |
| `TRIGGER_PROTOCOL` | http |
| `POSTGRES_USER` | ${db_user} |
| `POSTGRES_PASSWORD` | ${db_password} |
| `POSTGRES_DB` | ${db_name} |
| `DATABASE_URL` | postgresql://${db_user}:${db_password}@postgres:5432/${db_name} |
| `MAGIC_LINK_SECRET` | ${magic_link_secret} |
| `SESSION_SECRET` | ${session_secret} |
| `ENCRYPTION_KEY` | ${encryption_key} |
| `PROVIDER_SECRET` | ${provider_secret} |
| `COORDINATOR_SECRET` | ${coordinator_secret} |
| `INTERNAL_OTEL_TRACE_DISABLED` | 1 |
| `INTERNAL_OTEL_TRACE_LOGGING_ENABLED` | 0 |
| `DEFAULT_ORG_EXECUTION_CONCURRENCY_LIMIT` | 300 |
| `DEFAULT_ENV_EXECUTION_CONCURRENCY_LIMIT` | 100 |
| `DIRECT_URL` | ${DATABASE_URL} |
| `REDIS_HOST` | redis |
| `REDIS_PORT` | 6379 |
| `REDIS_TLS_DISABLED` | true |
| `HTTP_SERVER_PORT` | 9020 |
| `COORDINATOR_HOST` | 127.0.0.1 |
| `COORDINATOR_PORT` | ${HTTP_SERVER_PORT} |

## Domains

| Service | Port | Host |
|---|---|---|
| `webapp` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
x-webapp-env: &webapp-env
  LOGIN_ORIGIN: &trigger-url ${TRIGGER_PROTOCOL:-http}://${TRIGGER_DOMAIN:-localhost:3040}
  APP_ORIGIN: *trigger-url
  DEV_OTEL_EXPORTER_OTLP_ENDPOINT: &trigger-otel ${TRIGGER_PROTOCOL:-http}://${TRIGGER_DOMAIN:-localhost:3040}/otel
  ELECTRIC_ORIGIN: http://electric:3000

x-worker-env: &worker-env
  PLATFORM_HOST: webapp
  PLATFORM_WS_PORT: 3030
  SECURE_CONNECTION: "false"
  OTEL_EXPORTER_OTLP_ENDPOINT: *trigger-otel

volumes:
  postgres-data:
  redis-data:

networks:
  webapp:

services:
  webapp:
    image: ghcr.io/triggerdotdev/trigger.dev:${TRIGGER_IMAGE_TAG:-v3}
    restart: ${RESTART_POLICY:-unless-stopped}
    env_file:
      - .env
    environment:
      <<: *webapp-env
    ports:
      - 3000
    depends_on:
      - postgres
      - redis
    networks:
      - webapp

  postgres:
    image: postgres:${POSTGRES_IMAGE_TAG:-16}
    restart: ${RESTART_POLICY:-unless-stopped}
    volumes:
      - postgres-data:/var/lib/postgresql/data/
    env_file:
      - .env
    networks:
      - webapp
    ports:
      - 5432
    command:
      - -c
      - wal_level=logical

  redis:
    image: redis:${REDIS_IMAGE_TAG:-7}
    restart: ${RESTART_POLICY:-unless-stopped}
    volumes:
      - redis-data:/data
    networks:
      - webapp
    ports:
      - 6379

  docker-provider:
    image: ghcr.io/triggerdotdev/provider/docker:${TRIGGER_IMAGE_TAG:-v3}
    restart: ${RESTART_POLICY:-unless-stopped}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    user: root
    networks:
      - webapp
    depends_on:
      - webapp
    ports:
      - 9020
    env_file:
      - .env
    environment:
      <<: *worker-env
      PLATFORM_SECRET: $PROVIDER_SECRET

  coordinator:
    image: ghcr.io/triggerdotdev/coordinator:${TRIGGER_IMAGE_TAG:-v3}
    restart: ${RESTART_POLICY:-unless-stopped}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    user: root
    networks:
      - webapp
    depends_on:
      - webapp
    ports:
      - 9020
    env_file:
      - .env
    environment:
      <<: *worker-env
      PLATFORM_SECRET: $COORDINATOR_SECRET

  electric:
    image: electricsql/electric:${ELECTRIC_IMAGE_TAG:-latest}
    restart: ${RESTART_POLICY:-unless-stopped}
    environment:
      DATABASE_URL: ${DATABASE_URL}?sslmode=disable
    networks:
      - webapp
    depends_on:
      - postgres
    ports:
      - 3000
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
