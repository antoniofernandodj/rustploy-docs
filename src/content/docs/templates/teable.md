---
title: Hospedar Teable com Rustploy
description: "Banco de dados baseado em Postgres com interface visual de planilha de altíssima performance. Crie Teable em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Teable**: Banco de dados baseado em Postgres com interface visual de planilha de altíssima performance. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `teable` |
| **Containers** | 3 (`teable`, `teable-db`, `teable-db-migrate`) |
| **Imagens** | `ghcr.io/teableio/teable:latest`, `postgres:15.4`, `ghcr.io/teableio/teable-db-migrate:latest` |
| **Porta da interface** | 3000, no serviço `teable` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Teable** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `public_db_port` | ${randomPort} |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TEABLE_HOST` | ${main_domain} |
| `TEABLE_DB_PORT` | ${public_db_port} |
| `TIMEZONE` | UTC |
| `POSTGRES_HOST` | teable-db |
| `POSTGRES_PORT` | 5432 |
| `POSTGRES_DB` | teable |
| `POSTGRES_USER` | teable |
| `POSTGRES_PASSWORD` | ${db_password} |
| `PUBLIC_ORIGIN` | https://${main_domain} |
| `PRISMA_DATABASE_URL` | postgresql://teable:${db_password}@teable-db:5432/teable |
| `PUBLIC_DATABASE_PROXY` | ${TEABLE_HOST}:${TEABLE_DB_PORT} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `teable` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.9"

services:
  teable:
    image: ghcr.io/teableio/teable:latest
    restart: always
    volumes:
      - teable-data:/app/.assets
      # you may use a bind-mounted host directory instead,
      # so that it is harder to accidentally remove the volume and lose all your data!
      # - ./docker/teable/data:/app/.assets:rw
    environment:
      - TZ=${TIMEZONE}
      - NEXT_ENV_IMAGES_ALL_REMOTE=true
      - PUBLIC_ORIGIN=${PUBLIC_ORIGIN}
      - PRISMA_DATABASE_URL=${PRISMA_DATABASE_URL}
      - PUBLIC_DATABASE_PROXY=${PUBLIC_DATABASE_PROXY}
      - BACKEND_MAIL_HOST=${BACKEND_MAIL_HOST}
      - BACKEND_MAIL_PORT=${BACKEND_MAIL_PORT}
      - BACKEND_MAIL_SECURE=${BACKEND_MAIL_SECURE}
      - BACKEND_MAIL_SENDER=${BACKEND_MAIL_SENDER}
      - BACKEND_MAIL_SENDER_NAME=${BACKEND_MAIL_SENDER_NAME}
      - BACKEND_MAIL_AUTH_USER=${BACKEND_MAIL_AUTH_USER}
      - BACKEND_MAIL_AUTH_PASS=${BACKEND_MAIL_AUTH_PASS}
    depends_on:
      teable-db-migrate:
        condition: service_completed_successfully

  teable-db:
    image: postgres:15.4
    restart: always
    ports:
      - "${TEABLE_DB_PORT}:${POSTGRES_PORT}"
    volumes:
      - teable-db:/var/lib/postgresql/data
      # you may use a bind-mounted host directory instead,
      # so that it is harder to accidentally remove the volume and lose all your data!
      # - ./docker/db/data:/var/lib/postgresql/data:rw
    environment:
      - TZ=${TIMEZONE}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

    healthcheck:
      test:
        [
          "CMD-SHELL",
          "sh -c 'pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}'",
        ]
      interval: 10s
      timeout: 3s
      retries: 3

  teable-db-migrate:
    image: ghcr.io/teableio/teable-db-migrate:latest
    environment:
      - TZ=${TIMEZONE}
      - PRISMA_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}

    depends_on:
      teable-db:
        condition: service_healthy

volumes:
  teable-data: {}
  teable-db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
