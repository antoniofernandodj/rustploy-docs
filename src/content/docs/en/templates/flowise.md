---
title: Host Flowise with Rustploy
description: "Visual no-code interface for building and orchestrating LLM chains. Create Flowise in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Flowise**: Visual no-code interface for building and orchestrating LLM chains. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `flowise` |
| **Containers** | 3 (`redis`, `flowise`, `flowise-worker`) |
| **Images** | `redis:alpine`, `flowiseai/flowise:latest`, `flowiseai/flowise-worker:latest` |
| **UI port** | 3000, on service `flowise` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Flowise** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 32 characters* |
| `jwt_refresh_secret` | *random password, 32 characters* |
| `express_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_AUTH_TOKEN_SECRET` | *generated JWT* |
| `JWT_REFRESH_TOKEN_SECRET` | *generated JWT* |
| `EXPRESS_SESSION_SECRET` | ${express_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `flowise` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data

  flowise:
    image: flowiseai/flowise:latest
    restart: always
    expose:
      - 3000
    volumes:
      - flowise_data:/root/.flowise
    environment:
      PORT: 3000
      DATABASE_PATH: /root/.flowise
      REDIS_URL: redis://redis:6379
      JWT_AUTH_TOKEN_SECRET: ${JWT_AUTH_TOKEN_SECRET}
      JWT_REFRESH_TOKEN_SECRET: ${JWT_REFRESH_TOKEN_SECRET}
      EXPRESS_SESSION_SECRET: ${EXPRESS_SESSION_SECRET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    entrypoint: /bin/sh -c "sleep 3; flowise start"
    depends_on:
      - redis

  flowise-worker:
    image: flowiseai/flowise-worker:latest
    restart: always
    volumes:
      - flowise_data:/root/.flowise
    environment:
      WORKER_PORT: 5566
      DATABASE_PATH: /root/.flowise
      REDIS_URL: redis://redis:6379
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5566/healthz"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    entrypoint: /bin/sh -c "node /app/healthcheck/healthcheck.js & sleep 5 && pnpm run start-worker"
    depends_on:
      - redis
      - flowise

volumes:
  redis_data:
  flowise_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
