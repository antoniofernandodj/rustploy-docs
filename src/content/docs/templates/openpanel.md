---
title: Hospedar OpenPanel com Rustploy
description: "Analytics web focado em privacidade, agindo como substituto limpo do Google Analytics ou Mixpanel. Crie OpenPanel em um clique no Rustploy: 6 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**OpenPanel**: Analytics web focado em privacidade, agindo como substituto limpo do Google Analytics ou Mixpanel. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `openpanel` |
| **Containers** | 6 (`op-db`, `op-kv`, `op-ch`, `op-api`, `op-dashboard`, `op-worker`) |
| **Imagens** | `postgres:14-alpine`, `redis:7.2.5-alpine`, `clickhouse/clickhouse-server:25.10.2.65`, `lindesvard/openpanel-api:2`, `lindesvard/openpanel-dashboard:2`, `lindesvard/openpanel-worker:2` |
| **Porta da interface** | 3000, no serviço `op-dashboard` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **OpenPanel** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `cookie_secret` | *chave base64 aleatória (32 bytes)* |
| `redis_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DASHBOARD_URL` | http://${main_domain} |
| `API_URL` | http://${main_domain}/api |
| `POSTGRES_DB` | openpanel |
| `POSTGRES_USER` | openpanel |
| `POSTGRES_PASSWORD` | ${db_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `COOKIE_SECRET` | ${cookie_secret} |
| `ALLOW_REGISTRATION` | true |
| `ALLOW_INVITATION` | true |
| `EMAIL_SENDER` |  |
| `RESEND_API_KEY` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `op-dashboard` | 3000 | ${main_domain} |
| `op-api` | 3000 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./clickhouse_config/op-config.xml`
- `./clickhouse_users/op-user-config.xml`
- `./clickhouse_init/1_init-db.sql`

## docker-compose.yml do template

```yaml
x-common: &x-common
  NODE_ENV: production
  SELF_HOSTED: "true"
  API_URL: ${API_URL}
  DASHBOARD_URL: ${DASHBOARD_URL}
  DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@op-db:5432/${POSTGRES_DB}?schema=public
  DATABASE_URL_DIRECT: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@op-db:5432/${POSTGRES_DB}?schema=public
  REDIS_URL: redis://default:${REDIS_PASSWORD}@op-kv:6379
  CLICKHOUSE_URL: http://op-ch:8123/openpanel

services:
  op-db:
    image: postgres:14-alpine
    restart: always
    volumes:
      - op-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}']
      interval: 10s
      timeout: 5s
      retries: 5
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  op-kv:
    image: redis:7.2.5-alpine
    restart: always
    volumes:
      - op-kv-data:/data
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory-policy noeviction
    healthcheck:
      test: ['CMD', 'redis-cli', '-a', '${REDIS_PASSWORD}', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  op-ch:
    image: clickhouse/clickhouse-server:25.10.2.65
    restart: always
    volumes:
      - op-ch-data:/var/lib/clickhouse
      - op-ch-logs:/var/log/clickhouse-server
      - ../files/clickhouse_config:/etc/clickhouse-server/config.d
      - ../files/clickhouse_users:/etc/clickhouse-server/users.d
      - ../files/clickhouse_init:/docker-entrypoint-initdb.d
    environment:
      - CLICKHOUSE_SKIP_USER_SETUP=1
    healthcheck:
      test: ['CMD-SHELL', 'clickhouse-client --query "SELECT 1" -d openpanel']
      interval: 10s
      timeout: 5s
      retries: 5

  op-api:
    image: lindesvard/openpanel-api:2
    restart: always
    command: >
      sh -c "
        echo 'Waiting for PostgreSQL to be ready...'
        while ! nc -z op-db 5432; do
          sleep 1
        done
        echo 'PostgreSQL is ready'

        echo 'Waiting for ClickHouse to be ready...'
        while ! nc -z op-ch 8123; do
          sleep 1
        done
        echo 'ClickHouse is ready'

        echo 'Running migrations...'

        CI=true pnpm -r run migrate:deploy

        pnpm start
      "
    environment:
      COOKIE_SECRET: ${COOKIE_SECRET}
      ALLOW_REGISTRATION: ${ALLOW_REGISTRATION}
      ALLOW_INVITATION: ${ALLOW_INVITATION}
      EMAIL_SENDER: ${EMAIL_SENDER}
      RESEND_API_KEY: ${RESEND_API_KEY}
      <<: *x-common
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/healthcheck || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5
    depends_on:
      op-db:
        condition: service_healthy
      op-ch:
        condition: service_healthy
      op-kv:
        condition: service_healthy

  op-dashboard:
    image: lindesvard/openpanel-dashboard:2
    restart: always
    depends_on:
      op-api:
        condition: service_healthy
    environment:
      <<: *x-common
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/api/healthcheck || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5

  op-worker:
    image: lindesvard/openpanel-worker:2
    restart: always
    depends_on:
      op-api:
        condition: service_healthy
    environment:
      <<: *x-common
    healthcheck:
      test: ['CMD-SHELL', 'curl -f http://localhost:3000/healthcheck || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  op-db-data:
  op-kv-data:
  op-ch-data:
  op-ch-logs:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
