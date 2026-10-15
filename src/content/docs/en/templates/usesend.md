---
title: Host useSend with Rustploy
description: "Open platform for bulk and transactional email sending (Resend and SendGrid alternative). Create useSend in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**useSend**: Open platform for bulk and transactional email sending (Resend and SendGrid alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `usesend` |
| **Containers** | 4 (`usesend-db-prod`, `usesend-redis-prod`, `usesend-storage-prod`, `usesend`) |
| **Images** | `postgres:16`, `redis:7`, `minio/minio:latest`, `usesend/usesend:latest` |
| **UI port** | 3000, on service `usesend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **useSend** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_base` | *random base64 key (64 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `REDIS_URL` | redis://usesend-redis-prod:6379 |
| `POSTGRES_USER` | postgres |
| `POSTGRES_PASSWORD` | postgres |
| `POSTGRES_DB` | usesend |
| `DATABASE_URL` | postgresql://postgres:postgres@usesend-db-prod:5432/usesend |
| `NEXTAUTH_URL` | http://localhost:3000 |
| `NEXTAUTH_SECRET` | ${secret_base} |
| `GITHUB_ID` | 'Fill' |
| `GITHUB_SECRET` | 'Fill' |
| `AWS_DEFAULT_REGION` | us-east-1 |
| `AWS_SECRET_KEY` | 'Fill' |
| `AWS_ACCESS_KEY` | 'Fill' |
| `DOCKER_OUTPUT` | 1 |
| `API_RATE_LIMIT` | 1 |

## Domains

| Service | Port | Host |
|---|---|---|
| `usesend` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
name: usesend-prod

services:
  usesend-db-prod:
    image: postgres:16

    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    # ports:
    #   - "5432:5432"
    volumes:
      - database:/var/lib/postgresql/data

  usesend-redis-prod:
    image: redis:7

    restart: always
    # ports:
    #   - "6379:6379"
    volumes:
      - cache:/data
    command: ["redis-server", "--maxmemory-policy", "noeviction"]

  usesend-storage-prod:
    image: minio/minio:latest

    ports:
      - 9002
      - 9001
    volumes:
      - storage:/data
    environment:
      MINIO_ROOT_USER: usesend
      MINIO_ROOT_PASSWORD: password
    entrypoint: sh
    command: -c 'mkdir -p /data/usesend && minio server /data --console-address ":9001" --address ":9002"'

  usesend:
    image: usesend/usesend:latest
    restart: always
    ports:
      - ${PORT:-3000}
    environment:
      - PORT=${PORT:-3000}
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
      - AWS_SECRET_KEY=${AWS_SECRET_KEY}
      - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
      - GITHUB_ID=${GITHUB_ID}
      - GITHUB_SECRET=${GITHUB_SECRET}
      - REDIS_URL=${REDIS_URL}
      - NEXT_PUBLIC_IS_CLOUD=${NEXT_PUBLIC_IS_CLOUD:-false}
      - API_RATE_LIMIT=${API_RATE_LIMIT:-1}
    depends_on:
      usesend-db-prod:
        condition: service_healthy
      usesend-redis-prod:
        condition: service_started

volumes:
  database:
  cache:
  storage:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
