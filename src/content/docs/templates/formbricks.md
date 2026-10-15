---
title: Hospedar Formbricks com Rustploy
description: "Ferramenta modular para criação e análise de pesquisas com usuários. Crie Formbricks em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Formbricks**: Ferramenta modular para criação e análise de pesquisas com usuários. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `formbricks` |
| **Containers** | 2 (`postgres`, `formbricks`) |
| **Imagens** | `pgvector/pgvector:pg17`, `ghcr.io/formbricks/formbricks:v3.1.5` |
| **Porta da interface** | 3000, no serviço `formbricks` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Formbricks** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_base` | *chave base64 aleatória (64 bytes)* |
| `encryption_key` | *senha aleatória de 32 caracteres* |
| `cron_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `WEBAPP_URL` | http://${main_domain} |
| `NEXTAUTH_URL` | http://${main_domain} |
| `NEXTAUTH_SECRET` | ${secret_base} |
| `ENCRYPTION_KEY` | ${encryption_key} |
| `CRON_SECRET` | ${cron_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `formbricks` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
x-environment: &environment
  environment:
    WEBAPP_URL: ${WEBAPP_URL}
    NEXTAUTH_URL: ${NEXTAUTH_URL}
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/formbricks?schema=public"
    NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    ENCRYPTION_KEY: ${ENCRYPTION_KEY}
    CRON_SECRET: ${CRON_SECRET}
    EMAIL_VERIFICATION_DISABLED: 1
    PASSWORD_RESET_DISABLED: 1
    S3_FORCE_PATH_STYLE: 0

services:
  postgres:
    restart: always
    image: pgvector/pgvector:pg17
    volumes:
      - postgres:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres


  formbricks:
    restart: always
    image: ghcr.io/formbricks/formbricks:v3.1.5
    depends_on:
      - postgres
    ports:
      - 3000
    volumes:
      - ../files/uploads:/home/nextjs/apps/web/uploads/
    <<: *environment

volumes:
  postgres:
    driver: local
  uploads:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
