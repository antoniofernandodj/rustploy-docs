---
title: Host XSSHunter with Rustploy
description: "Advanced tool for security researchers focused on finding Blind XSS flaws. Create XSSHunter in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**XSSHunter**: Advanced tool for security researchers focused on finding Blind XSS flaws. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `xsshunter` |
| **Containers** | 3 (`xsshunterexpress-db`, `xsshunterexpress-service`, `xsshunterexpress-trufflehog`) |
| **Images** | `postgres:15-alpine` |
| **UI port** | 8080, on service `xsshunterexpress-service` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **XSSHunter** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `admin_domain` | *domain (generated; replace it with yours)* |
| `xss_domain` | *domain (generated; replace it with yours)* |
| `session_secret` | *random base64 key (64 bytes)* |
| `admin_password` | *random password, 32 characters* |
| `db_password` | *random password, 16 characters* |
| `postgres_user` | xsshunterexpress |
| `postgres_db` | xsshunterexpress |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SESSION_SECRET_KEY` | ${session_secret} |
| `HOSTNAME` | ${admin_domain} |
| `XSS_HOSTNAME` | xss.${admin_domain} |
| `PANEL_LOGIN` | true |
| `PANEL_USERNAME` | admin@${admin_domain} |
| `PANEL_PASSWORD` | ${admin_password} |
| `ALLOW_EMPTY_USERPATH` | true |
| `OAUTH_LOGIN` | false |
| `CLIENT_ID` |  |
| `CLIENT_SECRET` |  |
| `GMAIL_ACCOUNTS` |  |
| `EMAIL_NOTIFICATIONS_ENABLED` | false |
| `EMAIL_FROM` |  |
| `SENDGRID_API_KEY` |  |
| `SENDGRID_UNSUBSRIBE_GROUP_ID` |  |
| `DATABASE_HOST` | xsshunterexpress-db |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${db_password} |
| `NODE_ENV` | production |
| `PORT` | 8080 |
| `CONTROL_PANEL_ENABLED` | true |
| `SCREENSHOTS_DIR` | /app/payload-fire-images |
| `TRUFFLEHOG_URL` | http://${TRUFFLEHOG_HOST}:${TRUFFLEHOG_PORT}/trufflehog |
| `APP_PORT` | 8080 |
| `TRUFFLEHOG_HOST` | xsshunterexpress-trufflehog |
| `TRUFFLEHOG_PORT` | 8000 |
| `SENTRY_DSN` |  |
| `SENTRY_ENABLED` | false |
| `USE_CLOUD_STORAGE` | false |
| `BUCKET_NAME` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `xsshunterexpress-service` | 8080 | ${admin_domain} |
| `xsshunterexpress-service` | 8080 | xss.${admin_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./payload-fire-images`

## The template docker-compose.yml

```yaml
#version: '3.8'

services:
  xsshunterexpress-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-xsshunterexpress}
      POSTGRES_USER: ${POSTGRES_USER:-xsshunterexpress}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-xsshunterexpress}
      PGDATA: /var/lib/postgresql/data/pgdata
      POSTGRES_HOST_AUTH_METHOD: trust
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-xsshunterexpress}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    volumes:
      - postgres_data:/var/lib/postgresql/data/pgdata

  xsshunterexpress-service:
    build: https://github.com/rs-loves-bugs/xsshunter.git
    restart: unless-stopped
    environment:
      # Core Configuration
      SESSION_SECRET_KEY: ${SESSION_SECRET_KEY}
      HOSTNAME: ${HOSTNAME}
      XSS_HOSTNAME: ${XSS_HOSTNAME}
      
      # Panel Configuration
      PANEL_LOGIN: ${PANEL_LOGIN:-true}
      PANEL_USERNAME: ${PANEL_USERNAME}
      PANEL_PASSWORD: ${PANEL_PASSWORD}
      ALLOW_EMPTY_USERPATH: ${ALLOW_EMPTY_USERPATH:-true}
      
      # OAuth Configuration
      OAUTH_LOGIN: ${OAUTH_LOGIN:-false}
      CLIENT_ID: ${CLIENT_ID:-}
      CLIENT_SECRET: ${CLIENT_SECRET:-}
      GMAIL_ACCOUNTS: ${GMAIL_ACCOUNTS:-}
      
      # Email Configuration
      EMAIL_NOTIFICATIONS_ENABLED: ${EMAIL_NOTIFICATIONS_ENABLED:-false}
      EMAIL_FROM: ${EMAIL_FROM:-}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY:-}
      SENDGRID_UNSUBSRIBE_GROUP_ID: ${SENDGRID_UNSUBSRIBE_GROUP_ID:-}
      
      # Database Configuration
      DATABASE_HOST: xsshunterexpress-db
      POSTGRES_DB: ${POSTGRES_DB:-xsshunterexpress}
      POSTGRES_USER: ${POSTGRES_USER:-xsshunterexpress}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-xsshunterexpress}
      
      # Application Configuration
      NODE_ENV: ${NODE_ENV:-production}
      PORT: ${PORT}
      CONTROL_PANEL_ENABLED: ${CONTROL_PANEL_ENABLED:-true}
      SCREENSHOTS_DIR: /app/payload-fire-images
      TRUFFLEHOG_URL: http://${TRUFFLEHOG_HOST:-xsshunterexpress-trufflehog}:${TRUFFLEHOG_PORT:-8000}/trufflehog
      
      # Optional Services
      SENTRY_DSN: ${SENTRY_DSN:-}
      SENTRY_ENABLED: ${SENTRY_ENABLED:-false}
      USE_CLOUD_STORAGE: ${USE_CLOUD_STORAGE:-false}
      BUCKET_NAME: ${BUCKET_NAME:-}
    expose:
      - ${PORT:-8080}
    volumes:
      - payload_images:/app/payload-fire-images
    depends_on:
      xsshunterexpress-db:
        condition: service_healthy

  xsshunterexpress-trufflehog:
    build:
      context: https://github.com/rs-loves-bugs/xsshunter.git
      dockerfile: Dockerfile.trufflehog
    restart: unless-stopped
    expose:
      - ${TRUFFLEHOG_PORT:-8000}

volumes:
  postgres_data:
    driver: local
  payload_images:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
