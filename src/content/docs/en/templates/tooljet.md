---
title: Host Tooljet with Rustploy
description: "Low-code builder for internal tools natively connectable to multiple databases. Create Tooljet in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Tooljet**: Low-code builder for internal tools natively connectable to multiple databases. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `tooljet` |
| **Containers** | 2 (`tooljet`, `postgres`) |
| **Images** | `tooljet/tooljet:ee-lts-latest`, `postgres:13` |
| **UI port** | 80, on service `tooljet` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Tooljet** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `pg_pass` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `# Create .env from this example file and replace values for the environment.` |  |
| `# The application expects a separate .env.test for test environment configuration` |  |
| `# Get detailed information about each variable here: https://docs.tooljet.com/docs/setup/env-vars` |  |
| `` |  |
| `TOOLJET_HOST` | http://${main_domain}:80 |
| `TOOLJET_HTTP_PROXY` | http://${main_domain}:80 |
| `LOCKBOX_MASTER_KEY` | *random password, 32 characters* |
| `SECRET_KEY_BASE` | *random password, 64 characters* |
| `` |  |
| `# DATABASE CONFIG` |  |
| `ORM_LOGGING` | all |
| `PG_DB` | tooljet_production |
| `PG_USER` | postgres |
| `PG_HOST` | postgres |
| `PG_PASS` | ${pg_pass} |
| `` |  |
| `# The above postgres values is set to its default state. If necessary, kindly modify it according to your personal preference.` |  |
| `` |  |
| `# TOOLJET DATABASE` |  |
| `TOOLJET_DB` | tooljet_db |
| `TOOLJET_DB_USER` | postgres |
| `TOOLJET_DB_HOST` | postgres |
| `TOOLJET_DB_PASS` | ${pg_pass} |
| `` |  |
| `PGRST_DB_URI` | postgres://postgres:${pg_pass}@postgres/tooljet_db |
| `PGRST_HOST` | localhost:3002 |
| `PGRST_JWT_SECRET` | *random password, 32 characters* |
| `PGRST_SERVER_PORT` | 3002 |
| `` |  |
| `# Redis` |  |
| `REDIS_HOST` | localhost |
| `REDIS_PORT` | 6379 |
| `REDIS_USER` | default |
| `REDIS_PASSWORD` |  |
| `` |  |
| `# Checks every 24 hours to see if a new version of ToolJet is available` |  |
| `# (Enabled by default. Set false to disable)` |  |
| `CHECK_FOR_UPDATES` | true |
| `` |  |
| `# Checks every 24 hours to update app telemetry data to ToolJet hub.` |  |
| `# (Telemetry is enabled by default. Set value to true to disable.)` |  |
| `DISABLE_TOOLJET_TELEMETRY` | true |
| `` |  |
| `GOOGLE_CLIENT_ID` |  |
| `GOOGLE_CLIENT_SECRET` |  |
| `` |  |
| `# EMAIL CONFIGURATION` |  |
| `DEFAULT_FROM_EMAIL` | hello@tooljet.io |
| `SMTP_USERNAME` |  |
| `SMTP_PASSWORD` |  |
| `SMTP_DOMAIN` |  |
| `SMTP_PORT` |  |
| `` |  |
| `# DISABLE USER SIGNUPS (true or false). only applicable if Multi-Workspace feature is enabled` |  |
| `DISABLE_SIGNUPS` |  |
| `` |  |
| `# OBSERVABILITY` |  |
| `APM_VENDOR` |  |
| `SENTRY_DNS` |  |
| `SENTRY_DEBUG` |  |
| `` |  |
| `# FEATURE TOGGLE` |  |
| `COMMENT_FEATURE_ENABLE` |  |
| `ENABLE_MULTIPLAYER_EDITING` | true |
| `ENABLE_MARKETPLACE_FEATURE` | true |
| `` |  |
| `# SSO (Applicable only for Multi-Workspace)` |  |
| `SSO_GOOGLE_OAUTH2_CLIENT_ID` |  |
| `SSO_GIT_OAUTH2_CLIENT_ID` |  |
| `SSO_GIT_OAUTH2_CLIENT_SECRET` |  |
| `SSO_GIT_OAUTH2_HOST` |  |
| `SSO_ACCEPTED_DOMAINS` |  |
| `SSO_DISABLE_SIGNUPS` |  |
| `` |  |
| `#ONBOARDING` |  |
| `ENABLE_ONBOARDING_QUESTIONS_FOR_ALL_SIGN_UPS` |  |
| `` |  |
| `#session expiry in minutes` |  |
| `USER_SESSION_EXPIRY` | 2880 |
| `` |  |
| `#TELEMETRY` |  |
| `DEPLOYMENT_PLATFORM` | docker |

## Domains

| Service | Port | Host |
|---|---|---|
| `tooljet` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  tooljet:
    tty: true
    stdin_open: true
    image: tooljet/tooljet:ee-lts-latest
    restart: always
    env_file: .env
    # ports:
    #   - 80:80
    expose:
      - 80
    deploy: # Please adjust the resource according to your usecase
      resources:
        limits:
          cpus: '1'
          memory: 2G
    depends_on:
      - postgres
    environment:
      SERVE_CLIENT: "true"
      PORT: "80"
    command: npm run start:prod

  postgres:
    image: postgres:13
    restart: always
    deploy: # Please adjust the resource according to your usecase
      resources:
        limits:
          cpus: '2'
          memory: 3G
    volumes:
      - ../files/postgres:/var/lib/postgresql/data
    env_file: .env
    environment:
      - POSTGRES_USER=${PG_USER}
      - POSTGRES_PASSWORD=${PG_PASS}

volumes:
  certs:
  logs:
  fallbackcerts:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
