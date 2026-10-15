---
title: Hospedar Typebot com Rustploy
description: "Construtor visual de fluxos de conversação e chatbots interativos via blocos arrastáveis. Crie Typebot em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Typebot**: Construtor visual de fluxos de conversação e chatbots interativos via blocos arrastáveis. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `typebot` |
| **Containers** | 3 (`typebot-db`, `typebot-builder`, `typebot-viewer`) |
| **Imagens** | `postgres:14-alpine`, `baptistearno/typebot-builder:2.27`, `baptistearno/typebot-viewer:2.27.0` |
| **Porta da interface** | 3000, no serviço `typebot-builder` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Typebot** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `builder_domain` | *domínio (gerado; troque pelo seu)* |
| `viewer_domain` | *domínio (gerado; troque pelo seu)* |
| `encryption_secret` | *chave base64 aleatória (24 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ENCRYPTION_SECRET` | ${encryption_secret} |
| `NEXTAUTH_URL` | http://${builder_domain} |
| `NEXT_PUBLIC_VIEWER_URL` | http://${viewer_domain} |
| `ADMIN_EMAIL` | typebot@example.com |
| `SMTP_HOST` | 'Fill' |
| `SMTP_PORT` | 25 |
| `SMTP_USERNAME` | 'Fill' |
| `SMTP_PASSWORD` | 'Fill' |
| `NEXT_PUBLIC_SMTP_FROM` | typebot@example.com |
| `DEFAULT_WORKSPACE_PLAN` | UNLIMITED |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `typebot-builder` | 3000 | ${builder_domain} |
| `typebot-viewer` | 3000 | ${viewer_domain} |

## docker-compose.yml do template

```yaml
version: '3.3'

volumes:
  db-data:

services:
  typebot-db:
    image: postgres:14-alpine
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: typebot
      POSTGRES_DB: typebot
      POSTGRES_PASSWORD: typebot


  typebot-builder:
    image: baptistearno/typebot-builder:2.27
    restart: always
    depends_on:
      - typebot-db
    environment:
      ENCRYPTION_SECRET: '${ENCRYPTION_SECRET}'
      DATABASE_URL: 'postgresql://typebot:typebot@typebot-db:5432/typebot'
      NEXTAUTH_URL: '${NEXTAUTH_URL}'
      NEXT_PUBLIC_VIEWER_URL: '${NEXT_PUBLIC_VIEWER_URL}'
      ADMIN_EMAIL: '${ADMIN_EMAIL}'
      SMTP_HOST: '${SMTP_HOST}'
      NEXT_PUBLIC_SMTP_FROM: '${NEXT_PUBLIC_SMTP_FROM}'
      SMTP_USERNAME: '${SMTP_USERNAME}'
      SMTP_PASSWORD: '${SMTP_PASSWORD}'
      DEFAULT_WORKSPACE_PLAN: '${DEFAULT_WORKSPACE_PLAN}'

  typebot-viewer:
    image: baptistearno/typebot-viewer:2.27.0
    restart: always
    environment:
      ENCRYPTION_SECRET: '${ENCRYPTION_SECRET}'
      DATABASE_URL: postgresql://typebot:typebot@typebot-db:5432/typebot
      NEXTAUTH_URL: '${NEXTAUTH_URL}'
      NEXT_PUBLIC_VIEWER_URL: '${NEXT_PUBLIC_VIEWER_URL}'
      ADMIN_EMAIL: '${ADMIN_EMAIL}'
      SMTP_HOST: '${SMTP_HOST}'
      NEXT_PUBLIC_SMTP_FROM: '${NEXT_PUBLIC_SMTP_FROM}'
      SMTP_USERNAME: '${SMTP_USERNAME}'
      SMTP_PASSWORD: '${SMTP_PASSWORD}'
      DEFAULT_WORKSPACE_PLAN: '${DEFAULT_WORKSPACE_PLAN}'
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
