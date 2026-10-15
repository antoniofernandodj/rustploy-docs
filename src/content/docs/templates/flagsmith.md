---
title: Hospedar Flagsmith com Rustploy
description: "Ferramenta para gerenciamento de Feature Flags e configurações remotas. Crie Flagsmith em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Flagsmith**: Ferramenta para gerenciamento de Feature Flags e configurações remotas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `flagsmith` |
| **Containers** | 3 (`postgres`, `flagsmith`, `flagsmith-task-processor`) |
| **Imagens** | `postgres:15.5-alpine`, `docker.flagsmith.com/flagsmith/flagsmith:2.177.1` |
| **Porta da interface** | 8000, no serviço `flagsmith` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Flagsmith** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `django_secret_key` | *senha aleatória de 8 caracteres* |
| `database_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DATABASE_PASSWORD` | ${database_password} |
| `DJANGO_SECRET_KEY` | ${django_secret_key} |
| `FLAGSMITH_DOMAIN` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `flagsmith` | 8000 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
