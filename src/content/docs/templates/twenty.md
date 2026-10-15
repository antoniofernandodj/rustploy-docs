---
title: Hospedar Twenty com Rustploy
description: "Aplicação Twenty. Crie Twenty em um clique no Rustploy: 5 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Twenty**: Aplicação Twenty. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `twenty` |
| **Containers** | 5 (`twenty-change-vol-ownership`, `twenty-server`, `twenty-worker`, `twenty-postgres`, `twenty-redis`) |
| **Imagens** | `ubuntu`, `twentycrm/twenty:latest`, `postgres:17-alpine`, `redis:latest` |
| **Porta da interface** | 3000, no serviço `twenty-server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Twenty** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `db_user` | twenty |
| `app_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `HTTP_PROTOCOL` | http |
| `TWENTY_HOST` | ${main_domain} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `APP_SECRET` | ${app_secret} |
| `IS_SIGN_UP_DISABLED` | false |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `twenty-server` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  twenty-change-vol-ownership:
    image: ubuntu
    user: root

    volumes:
      - twenty-server-local-data:/tmp/server-local-data
      - twenty-docker-data:/tmp/docker-data
    command: >
      bash -c "
      chown -R 1000:1000 /tmp/server-local-data
      && chown -R 1000:1000 /tmp/docker-data"

  twenty-server:
    image: twentycrm/twenty:latest

    volumes:
      - twenty-server-local-data:/app/packages/twenty-server/${STORAGE_LOCAL_PATH:-.local-storage}
      - twenty-docker-data:/app/docker-data
    environment:
      PORT: 3000
      SERVER_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}
      FRONT_BASE_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}

      PG_DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@twenty-postgres:5432/twenty
      ENABLE_DB_MIGRATIONS: "true"

      REDIS_URL: redis://twenty-redis:6379
      IS_SIGN_UP_DISABLED: ${IS_SIGN_UP_DISABLED:-false}
      SIGN_IN_PREFILLED: "false"

      IS_CONFIG_VARIABLES_IN_DB_ENABLED: "true"
      STORAGE_TYPE: local

      APP_SECRET: ${APP_SECRET}
    depends_on:
      twenty-change-vol-ownership:
        condition: service_completed_successfully
      twenty-postgres:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/healthz"]
      interval: 5s
      timeout: 5s
      retries: 30
      start_period: 30s
    restart: always

  twenty-worker:
    image: twentycrm/twenty:latest

    command: ["yarn", "worker:prod"]
    environment:
      PG_DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@twenty-postgres:5432/twenty
      SERVER_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}
      FRONT_BASE_URL: ${HTTP_PROTOCOL}://${TWENTY_HOST}
      REDIS_URL: redis://twenty-redis:6379
      ENABLE_DB_MIGRATIONS: "false"
      STORAGE_TYPE: local
      APP_SECRET: ${APP_SECRET}
    depends_on:
      twenty-postgres:
        condition: service_healthy
      twenty-server:
        condition: service_healthy
    restart: always

  twenty-postgres:
    image: postgres:17-alpine

    volumes:
      - twenty-postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: twenty
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d twenty"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: always

  twenty-redis:
    image: redis:latest

    volumes:
      - twenty-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: always

volumes:
  twenty-docker-data:
  twenty-postgres-data:
  twenty-server-local-data:
  twenty-redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
