---
title: Host Infisical with Rustploy
description: "Unified platform for managing secrets, keys and environment variables. Create Infisical in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Infisical**: Unified platform for managing secrets, keys and environment variables. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `infisical` |
| **Containers** | 4 (`db-migration`, `backend`, `redis`, `db`) |
| **Images** | `infisical/infisical:v0.135.0-postgres`, `redis:7.4.1`, `postgres:14-alpine` |
| **UI port** | 8080, on service `backend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Infisical** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `postgres_user` | infisical |
| `postgres_db` | infisical |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ENCRYPTION_KEY` | 6c1fe4e407b8911c104518103505b218 |
| `AUTH_SECRET` | 5lrMXKKWCVocS/uerPsl7V+TX/aaUaI7iDkgl3tSmLE= |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_DB` | ${postgres_db} |
| `SITE_URL` | http://${main_domain}:8080 |
| `SMTP_HOST` |  |
| `SMTP_PORT` |  |
| `SMTP_NAME` |  |
| `SMTP_USERNAME` |  |
| `SMTP_PASSWORD` |  |
| `CLIENT_ID_HEROKU` |  |
| `CLIENT_ID_VERCEL` |  |
| `CLIENT_ID_NETLIFY` |  |
| `CLIENT_ID_GITHUB` |  |
| `CLIENT_ID_GITHUB_APP` |  |
| `CLIENT_SLUG_GITHUB_APP` |  |
| `CLIENT_ID_GITLAB` |  |
| `CLIENT_ID_BITBUCKET` |  |
| `CLIENT_SECRET_HEROKU` |  |
| `CLIENT_SECRET_VERCEL` |  |
| `CLIENT_SECRET_NETLIFY` |  |
| `CLIENT_SECRET_GITHUB` |  |
| `CLIENT_SECRET_GITHUB_APP` |  |
| `CLIENT_SECRET_GITLAB` |  |
| `CLIENT_SECRET_BITBUCKET` |  |
| `CLIENT_SLUG_VERCEL` |  |
| `CLIENT_PRIVATE_KEY_GITHUB_APP` |  |
| `CLIENT_APP_ID_GITHUB_APP` |  |
| `SENTRY_DSN` |  |
| `POSTHOG_HOST` |  |
| `POSTHOG_PROJECT_API_KEY` |  |
| `CLIENT_ID_GOOGLE_LOGIN` |  |
| `CLIENT_SECRET_GOOGLE_LOGIN` |  |
| `CLIENT_ID_GITHUB_LOGIN` |  |
| `CLIENT_SECRET_GITHUB_LOGIN` |  |
| `CLIENT_ID_GITLAB_LOGIN` |  |
| `CLIENT_SECRET_GITLAB_LOGIN` |  |
| `CAPTCHA_SECRET` |  |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY` |  |
| `PLAIN_API_KEY` |  |
| `PLAIN_WISH_LABEL_IDS` |  |
| `SSL_CLIENT_CERTIFICATE_HEADER_KEY` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `backend` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  db-migration:
    depends_on:
      db:
        condition: service_healthy
    image: infisical/infisical:v0.135.0-postgres
    environment:
      - NODE_ENV=production
      - ENCRYPTION_KEY
      - AUTH_SECRET
      - SITE_URL
      - DB_CONNECTION_URI=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST
      - SMTP_PORT
      - SMTP_FROM_NAME
      - SMTP_USERNAME
      - SMTP_PASSWORD
      - SMTP_SECURE=true
    command: npm run migration:latest
    pull_policy: always

  backend:
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
      db-migration:
        condition: service_completed_successfully
    image: infisical/infisical:v0.135.0-postgres
    pull_policy: always
    environment:
      - NODE_ENV=production
      - ENCRYPTION_KEY
      - AUTH_SECRET
      - SITE_URL
      - DB_CONNECTION_URI=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST
      - SMTP_PORT
      - SMTP_FROM_NAME
      - SMTP_USERNAME
      - SMTP_PASSWORD
      - SMTP_SECURE=true


  redis:
    image: redis:7.4.1
    env_file: .env
    restart: always
    environment:
      - ALLOW_EMPTY_PASSWORD=yes

    volumes:
      - redis_infisical_data:/data

  db:
    image: postgres:14-alpine
    restart: always
    environment:
      - POSTGRES_PASSWORD
      - POSTGRES_USER
      - POSTGRES_DB
    volumes:
      - pg_infisical_data:/var/lib/postgresql/data

    healthcheck:
      test: "pg_isready --username=${POSTGRES_USER} && psql --username=${POSTGRES_USER} --list"
      interval: 5s
      timeout: 10s
      retries: 10

volumes:
  pg_infisical_data:
  redis_infisical_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
