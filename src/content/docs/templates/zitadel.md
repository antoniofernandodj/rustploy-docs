---
title: Hospedar Zitadel com Rustploy
description: "Provedor de identidade e gestão de acessos de última geração com suporte nativo a multi-inquilinato (multi-tenancy). Crie Zitadel em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Zitadel**: Provedor de identidade e gestão de acessos de última geração com suporte nativo a multi-inquilinato (multi-tenancy). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `zitadel` |
| **Containers** | 2 (`zitadel`, `db`) |
| **Imagens** | `ghcr.io/zitadel/zitadel:latest`, `postgres:17-alpine` |
| **Porta da interface** | 8080, no serviço `zitadel` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Zitadel** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `zitadel_masterkey` | *senha aleatória de 32 caracteres* |
| `admin_username` | *usuário gerado* |
| `admin_email` | *e-mail gerado* |
| `admin_password` | AdminPassword123! |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ZITADEL_MASTERKEY` | ${zitadel_masterkey} |
| `EXTERNAL_DOMAIN` | ${main_domain} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME` | ${admin_username} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD` | ${admin_password} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS` | ${admin_email} |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME` | Admin |
| `ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME` | User |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `zitadel` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  zitadel:
    restart: 'always'
    image: 'ghcr.io/zitadel/zitadel:latest'
    command: 'start-from-init --masterkey "${ZITADEL_MASTERKEY}" --tlsMode disabled'
    environment:
      # Database Configuration
      ZITADEL_DATABASE_POSTGRES_HOST: db
      ZITADEL_DATABASE_POSTGRES_PORT: 5432
      ZITADEL_DATABASE_POSTGRES_DATABASE: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_USERNAME: zitadel
      ZITADEL_DATABASE_POSTGRES_USER_PASSWORD: "${POSTGRES_PASSWORD}"
      ZITADEL_DATABASE_POSTGRES_USER_SSL_MODE: disable
      ZITADEL_DATABASE_POSTGRES_ADMIN_USERNAME: postgres
      ZITADEL_DATABASE_POSTGRES_ADMIN_PASSWORD: "${POSTGRES_PASSWORD}"
      ZITADEL_DATABASE_POSTGRES_ADMIN_SSL_MODE: disable

      # External Configuration for HTTP only - TLS mode disabled
      ZITADEL_EXTERNALSECURE: false
      ZITADEL_EXTERNALPORT: 8080
      ZITADEL_EXTERNALDOMAIN: "${EXTERNAL_DOMAIN}"
      ZITADEL_TLS_ENABLED: false

      # Disable Email Notifications
      ZITADEL_NOTIFICATIONS_SMTP_HOST: ""
      ZITADEL_NOTIFICATIONS_SMTP_PORT: ""

      # Custom Admin User Configuration
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_USERNAME}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_PASSWORD}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_EMAIL_ADDRESS}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_FIRSTNAME}"
      ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME: "${ZITADEL_FIRSTINSTANCE_ORG_HUMAN_LASTNAME}"
      
      # Default Instance Features
      ZITADEL_DEFAULTINSTANCE_FEATURES_LOGINV2_REQUIRED: false

    depends_on:
      db:
        condition: 'service_healthy'
    ports:
      - '8080'
    volumes:
      - zitadel_data:/app/data

  db:
    restart: 'always'
    image: postgres:17-alpine
    environment:
      PGUSER: postgres
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
      POSTGRES_DB: zitadel
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-d", "zitadel", "-U", "postgres"]
      interval: '10s'
      timeout: '30s'
      retries: 5
      start_period: '20s'

volumes:
  postgres_data:
  zitadel_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
