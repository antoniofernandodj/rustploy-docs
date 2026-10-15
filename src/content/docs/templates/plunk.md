---
title: Hospedar Plunk com Rustploy
description: "Plataforma integrada para gerenciamento de disparos de e-mails transacionais e marketing. Crie Plunk em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Plunk**: Plataforma integrada para gerenciamento de disparos de e-mails transacionais e marketing. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `plunk` |
| **Containers** | 3 (`plunk`, `db`, `redis`) |
| **Imagens** | `driaug/plunk`, `postgres:alpine`, `redis:alpine` |
| **Porta da interface** | 3000, no serviço `plunk` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Plunk** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_user` | plunk |
| `postgres_db` | plunk |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_PASSWORD` | *senha aleatória de 32 caracteres* |
| `REDIS_URL` | redis://redis:6379 |
| `JWT_SECRET` | *senha aleatória de 64 caracteres* |
| `APP_URI` | https://${main_domain} |
| `AWS_REGION` | <your-aws-region> |
| `AWS_ACCESS_KEY_ID` | <your-aws-access-key-id> |
| `AWS_SECRET_ACCESS_KEY` | <your-aws-secret-access-key> |
| `AWS_SES_CONFIGURATION_SET` | <your-ses-configuration-set> |
| `DISABLE_SIGNUPS` | False |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `plunk` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
# IMPORTANT: Plunk requires HTTPS to work properly
# go to the "Domains" tab and enable HTTPS for your domain

services:
  plunk:
    image: driaug/plunk
    expose:
      - "3000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    environment:
      REDIS_URL: ${REDIS_URL}
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_SES_CONFIGURATION_SET: ${AWS_SES_CONFIGURATION_SET}
      APP_URI: ${APP_URI}
      NEXT_PUBLIC_API_URI: ${APP_URI}/api
      API_URI: ${APP_URI}/api
      DISABLE_SIGNUPS: ${DISABLE_SIGNUPS}
    entrypoint: ["/app/entry.sh"]
    restart: unless-stopped

  db:
    image: postgres:alpine
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      retries: 5
      timeout: 10s
    restart: unless-stopped
    expose:
      - 5432

  redis:
    image: redis:alpine
    restart: unless-stopped
    expose:
      - 6379
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
