---
title: Hospedar Tolgee com Rustploy
description: "Plataforma web para gerenciamento e tradução de strings de localização de software. Crie Tolgee em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Tolgee**: Plataforma web para gerenciamento e tradução de strings de localização de software. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `tolgee` |
| **Containers** | 1 (`app`) |
| **Imagens** | `tolgee/tolgee:latest` |
| **Porta da interface** | 8080, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Tolgee** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TOLGEE_AUTHENTICATION_ENABLED` | true |
| `TOLGEE_AUTHENTICATION_INITIAL_PASSWORD` | admin |
| `TOLGEE_AUTHENTICATION_INITIAL_USERNAME` | admin |
| `TOLGEE_AUTHENTICATION_JWT_SECRET` | *JWT gerado* |
| `TOLGEE_MACHINE_TRANSLATION_GOOGLE_API_KEY` | my_google_api_key |
| `TOLGEE_SMTP_AUTH` | true |
| `TOLGEE_SMTP_FROM` | Tolgee <no-reply@mydomain.com> |
| `TOLGEE_SMTP_HOST` | email-smtp.regional-region.amazonaws.com |
| `TOLGEE_SMTP_PASSWORD` | omg/my/password |
| `TOLGEE_SMTP_PORT` | 465 |
| `TOLGEE_SMTP_SSL_ENABLED` | true |
| `TOLGEE_SMTP_USERNAME` | user@company.com |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3"


services:
  app:
    image: tolgee/tolgee:latest
    volumes:
      - ./data:/data
      - ./config.yaml:/config.yaml
    ports:
      - '8080'
    environment:
      TOLGEE_FRONT_END_URL: ${TOLGEE_HOST}
      TOLGEE_AUTHENTICATION_ENABLED: ${TOLGEE_AUTHENTICATION_ENABLED}
      TOLGEE_AUTHENTICATION_INITIAL_PASSWORD: ${TOLGEE_AUTHENTICATION_INITIAL_PASSWORD}
      TOLGEE_AUTHENTICATION_INITIAL_USERNAME: ${TOLGEE_AUTHENTICATION_INITIAL_USERNAME}
      TOLGEE_AUTHENTICATION_JWT_SECRET: ${TOLGEE_AUTHENTICATION_JWT_SECRET}
      TOLGEE_MACHINE_TRANSLATION_GOOGLE_API_KEY: ${TOLGEE_MACHINE_TRANSLATION_GOOGLE_API_KEY}
      TOLGEE_SMTP_AUTH: ${TOLGEE_SMTP_AUTH}
      TOLGEE_SMTP_FROM: ${TOLGEE_SMTP_FROM}
      TOLGEE_SMTP_HOST: ${TOLGEE_SMTP_HOST}
      TOLGEE_SMTP_PASSWORD: ${TOLGEE_SMTP_PASSWORD}
      TOLGEE_SMTP_PORT: ${TOLGEE_SMTP_PORT}
      TOLGEE_SMTP_SSL_ENABLED: ${TOLGEE_SMTP_SSL_ENABLED}
      TOLGEE_SMTP_USERNAME: ${TOLGEE_SMTP_USERNAME}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
