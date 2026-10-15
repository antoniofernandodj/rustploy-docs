---
title: Hospedar Mealie com Rustploy
description: "Aplicação Mealie. Crie Mealie em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mealie**: Aplicação Mealie. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mealie` |
| **Containers** | 1 (`mealie`) |
| **Imagens** | `ghcr.io/mealie-recipes/mealie:latest` |
| **Porta da interface** | 9000, no serviço `mealie` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mealie** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `TZ` | Europe/London |
| `BASE_URL` | https://${main_domain} |
| `SMTP_HOST` |  |
| `SMTP_PORT` | 587 |
| `SMTP_AUTH_STRATEGY` | TLS |
| `SMTP_FROM_NAME` | Mealie |
| `SMTP_FROM_EMAIL` |  |
| `SMTP_USER` |  |
| `SMTP_PASSWORD` |  |
| `API_DOCS` | False |
| `ALLOW_SIGNUP` | false |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BASE_URL` | ${BASE_URL} |
| `TZ` | ${TZ} |
| `DEFAULT_GROUP` | Home |
| `DEFAULT_HOUSEHOLD` | Family |
| `API_DOCS` | ${API_DOCS} |
| `SECURITY_MAX_LOGIN_ATTEMPTS` | 10 |
| `SECURITY_USER_LOCKOUT_TIME` | 24 |
| `DAILY_SCHEDULE_TIME` | 01:00 |
| `ALLOW_SIGNUP` | ${ALLOW_SIGNUP} |
| `SMTP_HOST` | ${SMTP_HOST} |
| `SMTP_PORT` | ${SMTP_PORT} |
| `SMTP_AUTH_STRATEGY` | ${SMTP_AUTH_STRATEGY} |
| `SMTP_FROM_NAME` | ${SMTP_FROM_NAME} |
| `SMTP_FROM_EMAIL` | ${SMTP_FROM_EMAIL} |
| `SMTP_USER` | ${SMTP_USER} |
| `SMTP_PASSWORD` | ${SMTP_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mealie` | 9000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  mealie:
    image: ghcr.io/mealie-recipes/mealie:latest
    deploy:
      resources:
        limits:
          memory: 1000M
    volumes:
      - mealie-data:/app/data/
    environment:
      PUID: 1000
      PGID: 1000

      # Basic settings
      BASE_URL: ${BASE_URL}
      API_DOCS: ${API_DOCS}
      ALLOW_SIGNUP: ${ALLOW_SIGNUP}
      DEFAULT_GROUP: ${DEFAULT_GROUP}
      DEFAULT_HOUSEHOLD: ${DEFAULT_HOUSEHOLD}
      TZ: ${TZ}
      SECURITY_MAX_LOGIN_ATTEMPTS: ${SECURITY_MAX_LOGIN_ATTEMPTS}
      SECURITY_USER_LOCKOUT_TIME: ${SECURITY_USER_LOCKOUT_TIME}
      DAILY_SCHEDULE_TIME: ${DAILY_SCHEDULE_TIME}

      # Email settings
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_AUTH_STRATEGY: ${SMTP_AUTH_STRATEGY}
      SMTP_FROM_NAME: ${SMTP_FROM_NAME}
      SMTP_FROM_EMAIL: ${SMTP_FROM_EMAIL}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}

volumes:
  mealie-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
