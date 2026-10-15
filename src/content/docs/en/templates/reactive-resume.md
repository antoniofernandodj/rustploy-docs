---
title: Host Reactive Resume with Rustploy
description: "Modern resume builder based on structured sections with clean export. Create Reactive Resume in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Reactive Resume**: Modern resume builder based on structured sections with clean export. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `reactive-resume` |
| **Containers** | 4 (`postgres`, `minio`, `chrome`, `app`) |
| **Images** | `postgres:16-alpine`, `minio/minio:latest`, `ghcr.io/browserless/chromium:v2.18.0`, `amruthpillai/reactive-resume:latest` |
| **UI port** | 3000, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Reactive Resume** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `minio_user` | minioadmin |
| `minio_password` | *random password, 32 characters* |
| `chrome_token` | *random password, 32 characters* |
| `access_token_secret` | *random password, 64 characters* |
| `refresh_token_secret` | *random password, 64 characters* |
| `mail_from` | noreply@${main_domain} |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_DOMAIN` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `MINIO_ROOT_USER` | ${minio_user} |
| `MINIO_ROOT_PASSWORD` | ${minio_password} |
| `CHROME_TOKEN` | ${chrome_token} |
| `ACCESS_TOKEN_SECRET` | ${access_token_secret} |
| `REFRESH_TOKEN_SECRET` | ${refresh_token_secret} |
| `MAIL_FROM` | ${mail_from} |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |
| `minio` | 9000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    command: server /data
    volumes:
      - minio_data:/data
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}

  chrome:
    image: ghcr.io/browserless/chromium:v2.18.0
    extra_hosts:
      - "host.docker.internal:host-gateway"
    environment:
      TIMEOUT: 10000
      CONCURRENT: 10
      TOKEN: ${CHROME_TOKEN}
      EXIT_ON_HEALTH_FAILURE: "true"
      PRE_REQUEST_HEALTH_CHECK: "true"

  app:
    image: amruthpillai/reactive-resume:latest
    depends_on:
      - postgres
      - minio
      - chrome
    environment:
      PORT: 3000
      NODE_ENV: production
      PUBLIC_URL: https://${APP_DOMAIN}
      STORAGE_URL: https://${APP_DOMAIN}/default
      CHROME_TOKEN: ${CHROME_TOKEN}
      CHROME_URL: ws://chrome:3000
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/postgres
      ACCESS_TOKEN_SECRET: ${ACCESS_TOKEN_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
      MAIL_FROM: ${MAIL_FROM}
      STORAGE_ENDPOINT: minio
      STORAGE_PORT: 9000
      STORAGE_REGION: us-east-1
      STORAGE_BUCKET: default
      STORAGE_ACCESS_KEY: ${MINIO_ROOT_USER}
      STORAGE_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
      STORAGE_USE_SSL: "false"
      STORAGE_SKIP_BUCKET_CHECK: "false"


volumes:
  minio_data:
  postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
