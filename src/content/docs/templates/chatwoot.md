---
title: Hospedar Chatwoot com Rustploy
description: "Plataforma de atendimento omnichannel (Live Chat, WhatsApp, Redes Sociais). Crie Chatwoot em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Chatwoot**: Plataforma de atendimento omnichannel (Live Chat, WhatsApp, Redes Sociais). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `chatwoot` |
| **Containers** | 4 (`chatwoot-rails`, `chatwoot-sidekiq`, `chatwoot-postgres`, `chatwoot-redis`) |
| **Imagens** | `pgvector/pgvector:pg14`, `redis:alpine` |
| **Porta da interface** | 3000, no serviço `chatwoot-rails` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Chatwoot** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key_base` | *chave base64 aleatória (64 bytes)* |
| `postgres_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `FRONTEND_URL` | http://${main_domain} |
| `SECRET_KEY_BASE` | ${secret_key_base} |
| `RAILS_ENV` | production |
| `NODE_ENV` | production |
| `INSTALLATION_ENV` | docker |
| `RAILS_LOG_TO_STDOUT` | true |
| `LOG_LEVEL` | info |
| `DEFAULT_LOCALE` | en |
| `POSTGRES_HOST` | chatwoot-postgres |
| `POSTGRES_PORT` | 5432 |
| `POSTGRES_DATABASE` | chatwoot |
| `POSTGRES_USERNAME` | postgres |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_URL` | redis://chatwoot-redis:6379 |
| `ENABLE_ACCOUNT_SIGNUP` | false |
| `ACTIVE_STORAGE_SERVICE` | local |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `chatwoot-rails` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3'

x-base-config: &base-config
  image: chatwoot/chatwoot:v4.0.3
  volumes:
    - chatwoot-storage:/app/storage
  environment:
    - FRONTEND_URL=${FRONTEND_URL}
    - SECRET_KEY_BASE=${SECRET_KEY_BASE}
    - RAILS_ENV=${RAILS_ENV}
    - NODE_ENV=${NODE_ENV}
    - INSTALLATION_ENV=${INSTALLATION_ENV}
    - RAILS_LOG_TO_STDOUT=${RAILS_LOG_TO_STDOUT}
    - LOG_LEVEL=${LOG_LEVEL}
    - DEFAULT_LOCALE=${DEFAULT_LOCALE}
    - POSTGRES_HOST=${POSTGRES_HOST}
    - POSTGRES_PORT=${POSTGRES_PORT}
    - POSTGRES_DATABASE=${POSTGRES_DATABASE}
    - POSTGRES_USERNAME=${POSTGRES_USERNAME}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    - REDIS_URL=${REDIS_URL}
    - ENABLE_ACCOUNT_SIGNUP=${ENABLE_ACCOUNT_SIGNUP}
    - ACTIVE_STORAGE_SERVICE=${ACTIVE_STORAGE_SERVICE}

services:
  chatwoot-rails:
    <<: *base-config
    depends_on:
      chatwoot-postgres:
        condition: service_started
      chatwoot-redis:
        condition: service_started
    entrypoint: docker/entrypoints/rails.sh
    command: ['bundle', 'exec', 'sh', '-c', 'rails db:chatwoot_prepare && rails s -p 3000 -b 0.0.0.0']
    restart: always

  chatwoot-sidekiq:
    <<: *base-config
    depends_on:
      chatwoot-postgres:
        condition: service_started
      chatwoot-redis:
        condition: service_started
    command: ['bundle', 'exec', 'sidekiq', '-C', 'config/sidekiq.yml']
    restart: always

  chatwoot-postgres:
    image: pgvector/pgvector:pg14
    restart: always
    volumes:
      - chatwoot-postgres-data:/var/lib/postgresql/data
      - ./init-vector.sql:/docker-entrypoint-initdb.d/init-vector.sql
    environment:
      - POSTGRES_DB=${POSTGRES_DATABASE}
      - POSTGRES_USER=${POSTGRES_USERNAME}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  chatwoot-redis:
    image: redis:alpine
    restart: always
    volumes:
      - chatwoot-redis-data:/data

volumes:
  chatwoot-storage:
  chatwoot-postgres-data:
  chatwoot-redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
