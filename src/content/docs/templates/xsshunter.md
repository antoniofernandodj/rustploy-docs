---
title: Hospedar XSSHunter com Rustploy
description: "Ferramenta avançada para pesquisadores de segurança focada na identificação de falhas de Blind XSS. Crie XSSHunter em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**XSSHunter**: Ferramenta avançada para pesquisadores de segurança focada na identificação de falhas de Blind XSS. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `xsshunter` |
| **Containers** | 3 (`xsshunterexpress-db`, `xsshunterexpress-service`, `xsshunterexpress-trufflehog`) |
| **Imagens** | `postgres:15-alpine` |
| **Porta da interface** | 8080, no serviço `xsshunterexpress-service` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **XSSHunter** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `admin_domain` | *domínio (gerado; troque pelo seu)* |
| `xss_domain` | *domínio (gerado; troque pelo seu)* |
| `session_secret` | *chave base64 aleatória (64 bytes)* |
| `admin_password` | *senha aleatória de 32 caracteres* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `postgres_user` | xsshunterexpress |
| `postgres_db` | xsshunterexpress |

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `xsshunterexpress-service` | 8080 | ${admin_domain} |
| `xsshunterexpress-service` | 8080 | xss.${admin_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./payload-fire-images`

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
