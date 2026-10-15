---
title: Host Flagsmith with Rustploy
description: "Feature flag and remote configuration management tool. Create Flagsmith in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Flagsmith**: Feature flag and remote configuration management tool. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `flagsmith` |
| **Containers** | 3 (`postgres`, `flagsmith`, `flagsmith-task-processor`) |
| **Images** | `postgres:15.5-alpine`, `docker.flagsmith.com/flagsmith/flagsmith:2.177.1` |
| **UI port** | 8000, on service `flagsmith` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Flagsmith** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `django_secret_key` | *random password, 8 characters* |
| `database_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DATABASE_PASSWORD` | ${database_password} |
| `DJANGO_SECRET_KEY` | ${django_secret_key} |
| `FLAGSMITH_DOMAIN` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `flagsmith` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
# See https://docs.flagsmith.com/deployment/docker for more information on running Flagsmith in Docker
# This Docker Compose file will run the entire Flagsmith Platform

volumes:
  pgdata:


services:
  postgres:
    image: postgres:15.5-alpine
    environment:
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: flagsmith
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d flagsmith -U postgres"]
      interval: 2s
      timeout: 2s
      retries: 20
      start_period: 20s

  flagsmith:
    image: docker.flagsmith.com/flagsmith/flagsmith:2.177.1
    environment:
      # All environments variables are available here:
      # API: https://docs.flagsmith.com/deployment/locally-api#environment-variables
      # UI: https://docs.flagsmith.com/deployment/locally-frontend#environment-variables

      DATABASE_URL: postgresql://postgres:${DATABASE_PASSWORD}@postgres:5432/flagsmith
      USE_POSTGRES_FOR_ANALYTICS: "true" # Store API and Flag Analytics data in Postgres

      ENVIRONMENT: production # set to 'production' in production.
      DJANGO_ALLOWED_HOSTS: "*" # Change this in production
      FLAGSMITH_DOMAIN: ${FLAGSMITH_DOMAIN:-localhost:8000} # Change this in production
      DJANGO_SECRET_KEY: ${DJANGO_SECRET_KEY} # Change this in production
      # PREVENT_SIGNUP: 'true' # Uncomment to prevent additional signups
      # ALLOW_REGISTRATION_WITHOUT_INVITE: 'true'

      # Enable Task Processor
      TASK_RUN_METHOD: TASK_PROCESSOR # other options are: SYNCHRONOUSLY, SEPARATE_THREAD (default)
      PROMETHEUS_ENABLED: "true"

      # Uncomment if you want to enable Google OAuth. Note this does not turn Google OAuth on. You still need to use
      # Flagsmith on Flagsmith to enable it - https://docs.flagsmith.com/deployment/#oauth_google
      # DJANGO_SECURE_CROSS_ORIGIN_OPENER_POLICY: 'same-origin-allow-popups'

      # For more info on configuring E-Mails - https://docs.flagsmith.com/deployment/locally-api#environment-variables
      # Example SMTP:
      # EMAIL_BACKEND: django.core.mail.backends.smtp.EmailBackend
      # EMAIL_HOST: mail.example.com
      # SENDER_EMAIL: flagsmith@example.com
      # EMAIL_HOST_USER: flagsmith@example.com
      # EMAIL_HOST_PASSWORD: smtp_account_password
      # EMAIL_PORT: 587 # optional
      # EMAIL_USE_TLS: 'true' # optional
    ports:
      - 8000
    depends_on:
      postgres:
        condition: service_healthy

  # The flagsmith_processor service is only needed if TASK_RUN_METHOD set to TASK_PROCESSOR
  # in the application environment
  flagsmith-task-processor:
    image: docker.flagsmith.com/flagsmith/flagsmith:2.177.1
    environment:
      DATABASE_URL: postgresql://postgres:${DATABASE_PASSWORD}@postgres:5432/flagsmith
      USE_POSTGRES_FOR_ANALYTICS: "true"
      DJANGO_ALLOWED_HOSTS: "*"
      PROMETHEUS_ENABLED: "true"
    ports:
      - 8000
    depends_on:
      - flagsmith
    command: run-task-processor
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
