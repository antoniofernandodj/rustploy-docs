---
title: Host Colanode with Rustploy
description: "Colanode application. Create Colanode in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Colanode**: Colanode application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `colanode` |
| **Containers** | 4 (`postgres`, `valkey`, `minio`, `server`) |
| **Images** | `pgvector/pgvector:pg17`, `valkey/valkey:8.1`, `minio/minio:RELEASE.2025-04-08T15-41-24Z`, `ghcr.io/colanode/server:latest` |
| **UI port** | 3000, on service `server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Colanode** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SERVER_NAME` | My Colanode |
| `SERVER_AVATAR` | https://colanode.com/assets/logo-black.png |
| `POSTGRES_USER` | colanode_user |
| `POSTGRES_PASSWORD` | your_postgres_password |
| `POSTGRES_DB` | colanode_db |
| `VALKEY_PASSWORD` | your_valkey_password |
| `MINIO_ROOT_USER` | admin |
| `MINIO_ROOT_PASSWORD` | your_minio_password |
| `SMTP_ENABLED` | false |
| `SMTP_HOST` | smtp.gmail.com |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | your_smtp_username |
| `SMTP_PASSWORD` | your_smtp_password |
| `SMTP_EMAIL_FROM` | your_email@example.com |
| `SMTP_EMAIL_FROM_NAME` | Colanode |

## Domains

| Service | Port | Host |
|---|---|---|
| `server` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: pgvector/pgvector:pg17
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  valkey:
    image: valkey/valkey:8.1
    restart: always
    command: ["valkey-server", "--requirepass", "${VALKEY_PASSWORD}"]
    volumes:
      - valkey_data:/data

  minio:
    image: minio/minio:RELEASE.2025-04-08T15-41-24Z
    restart: always
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
      MINIO_BROWSER: "on"
      MINIO_DOMAIN: minio
      MINIO_ADDRESS: ":9000"
      MINIO_CONSOLE_ADDRESS: ":9001"
    volumes:
      - minio_data:/data
    entrypoint: sh
    command: -c 'mkdir -p /data/colanode-avatars /data/colanode-files && minio server /data --address ":9000" --console-address ":9001"'

  server:
    image: ghcr.io/colanode/server:latest
    restart: always
    depends_on:
      - postgres
      - valkey
      - minio
    environment:
      # ---------------------------------------------------------------
      # General Node/Server Config
      # ---------------------------------------------------------------
      NODE_ENV: production
      PORT: 3000

      # The server requires a name and avatar URL which will be displayed in the desktop app login screen.
      SERVER_NAME: ${SERVER_NAME}
      SERVER_AVATAR: ${SERVER_AVATAR}
      # Possible values for SERVER_MODE: 'standalone', 'cluster'
      SERVER_MODE: "standalone"

      # ---------------------------------------------------------------
      # Account Configuration
      # ---------------------------------------------------------------
      # Possible values for ACCOUNT_VERIFICATION_TYPE: 'automatic', 'manual', 'email'
      ACCOUNT_VERIFICATION_TYPE: "automatic"
      ACCOUNT_OTP_TIMEOUT: "600" # in seconds
      ACCOUNT_ALLOW_GOOGLE_LOGIN: "false"

      # ---------------------------------------------------------------
      # User Configuration
      # ---------------------------------------------------------------
      USER_STORAGE_LIMIT: "10737418240" # 10 GB
      USER_MAX_FILE_SIZE: "104857600" # 100 MB

      # ---------------------------------------------------------------
      # PostgreSQL Configuration
      # ---------------------------------------------------------------
      # The server expects a PostgreSQL database with the pgvector extension installed.
      POSTGRES_URL: "postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"

      # Optional variables for SSL connection to the database
      # POSTGRES_SSL_REJECT_UNAUTHORIZED: 'false'
      # POSTGRES_SSL_CA: ''
      # POSTGRES_SSL_KEY: ''
      # POSTGRES_SSL_CERT: ''

      # ---------------------------------------------------------------
      # Redis Configuration
      # ---------------------------------------------------------------
      REDIS_URL: "redis://:${VALKEY_PASSWORD}@valkey:6379/0"
      REDIS_DB: "0"
      # Optional variables:
      REDIS_JOBS_QUEUE_NAME: "jobs"
      REDIS_JOBS_QUEUE_PREFIX: "colanode"
      REDIS_EVENTS_CHANNEL: "events"

      # ---------------------------------------------------------------
      # S3 Configuration for Avatars
      # ---------------------------------------------------------------
      S3_AVATARS_ENDPOINT: "http://minio:9000"
      S3_AVATARS_ACCESS_KEY: ${MINIO_ROOT_USER}
      S3_AVATARS_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
      S3_AVATARS_BUCKET_NAME: "colanode-avatars"
      S3_AVATARS_REGION: "us-east-1"
      S3_AVATARS_FORCE_PATH_STYLE: "true"

      # ---------------------------------------------------------------
      # S3 Configuration for Files
      # ---------------------------------------------------------------
      STORAGE_S3_ENDPOINT: "http://minio:9000"
      STORAGE_S3_ACCESS_KEY: ${MINIO_ROOT_USER}
      STORAGE_S3_SECRET_KEY: ${MINIO_ROOT_PASSWORD}
      STORAGE_S3_BUCKET: "colanode-files"
      STORAGE_S3_REGION: "us-east-1"
      STORAGE_S3_FORCE_PATH_STYLE: "true"

      # ---------------------------------------------------------------
      # SMTP configuration
      # ---------------------------------------------------------------
      SMTP_ENABLED: ${SMTP_ENABLED}
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
      SMTP_EMAIL_FROM: ${SMTP_EMAIL_FROM}
      SMTP_EMAIL_FROM_NAME: ${SMTP_EMAIL_FROM_NAME}

      # ---------------------------------------------------------------
      # AI Configuration
      # ---------------------------------------------------------------
      # The AI integration is in experimental mode yet and we don't
      # recommend using it.
      # ---------------------------------------------------------------
      AI_ENABLED: "false"
      # ---------------------------------------------------------------

volumes:
  postgres_data:
  valkey_data:
  minio_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
