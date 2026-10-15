---
title: Hospedar Tooljet com Rustploy
description: "Construtor low-code de ferramentas internas conectável a múltiplos bancos de dados de forma nativa. Crie Tooljet em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Tooljet**: Construtor low-code de ferramentas internas conectável a múltiplos bancos de dados de forma nativa. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `tooljet` |
| **Containers** | 2 (`tooljet`, `postgres`) |
| **Imagens** | `tooljet/tooljet:ee-lts-latest`, `postgres:13` |
| **Porta da interface** | 80, no serviço `tooljet` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Tooljet** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `pg_pass` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `# Create .env from this example file and replace values for the environment.` |  |
| `# The application expects a separate .env.test for test environment configuration` |  |
| `# Get detailed information about each variable here: https://docs.tooljet.com/docs/setup/env-vars` |  |
| `` |  |
| `TOOLJET_HOST` | http://${main_domain}:80 |
| `TOOLJET_HTTP_PROXY` | http://${main_domain}:80 |
| `LOCKBOX_MASTER_KEY` | *senha aleatória de 32 caracteres* |
| `SECRET_KEY_BASE` | *senha aleatória de 64 caracteres* |
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
| `PGRST_JWT_SECRET` | *senha aleatória de 32 caracteres* |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `tooljet` | 80 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
