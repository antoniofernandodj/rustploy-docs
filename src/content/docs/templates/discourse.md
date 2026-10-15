---
title: Hospedar Discourse com Rustploy
description: "Plataforma moderna para fóruns de discussão e comunidades. Crie Discourse em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Discourse**: Plataforma moderna para fóruns de discussão e comunidades. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `discourse` |
| **Containers** | 4 (`discourse-db`, `discourse-redis`, `discourse-app`, `discourse-sidekiq`) |
| **Imagens** | `docker.io/bitnami/postgresql:17`, `docker.io/bitnami/redis:7.4`, `docker.io/bitnamilegacy/discourse:3.5.0` |
| **Porta da interface** | 3000, no serviço `discourse-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Discourse** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `redis_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DISCOURSE_HOST` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_PASSWORD` | ${redis_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `discourse-app` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.7'

services:
  discourse-db:
    image: docker.io/bitnami/postgresql:17

    volumes:
      - discourse-postgresql-data:/bitnami/postgresql
    environment:
      POSTGRESQL_USERNAME: bn_discourse
      POSTGRESQL_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRESQL_DATABASE: bitnami_discourse
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U bn_discourse -d bitnami_discourse"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  discourse-redis:
    image: docker.io/bitnami/redis:7.4

    volumes:
      - discourse-redis-data:/bitnami/redis
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  discourse-app:
    image: docker.io/bitnamilegacy/discourse:3.5.0

    volumes:
      - discourse-data:/bitnami/discourse
    depends_on:
      discourse-db:
        condition: service_healthy
      discourse-redis:
        condition: service_healthy
    environment:
      DISCOURSE_HOST: ${DISCOURSE_HOST}
      DISCOURSE_DATABASE_HOST: discourse-db
      DISCOURSE_DATABASE_PORT_NUMBER: 5432
      DISCOURSE_DATABASE_USER: bn_discourse
      DISCOURSE_DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DISCOURSE_DATABASE_NAME: bitnami_discourse
      DISCOURSE_REDIS_HOST: discourse-redis
      DISCOURSE_REDIS_PORT_NUMBER: 6379
      DISCOURSE_REDIS_PASSWORD: ${REDIS_PASSWORD}
      # Optional: Configure SMTP for email delivery
      # DISCOURSE_SMTP_HOST: ${SMTP_HOST}
      # DISCOURSE_SMTP_PORT: ${SMTP_PORT}
      # DISCOURSE_SMTP_USER: ${SMTP_USER}
      # DISCOURSE_SMTP_PASSWORD: ${SMTP_PASSWORD}
    restart: unless-stopped

  discourse-sidekiq:
    image: docker.io/bitnamilegacy/discourse:3.5.0

    volumes:
      - discourse-sidekiq-data:/bitnami/discourse
    depends_on:
      - discourse-app
    command: /opt/bitnami/scripts/discourse-sidekiq/run.sh
    environment:
      DISCOURSE_HOST: ${DISCOURSE_HOST}
      DISCOURSE_DATABASE_HOST: discourse-db
      DISCOURSE_DATABASE_PORT_NUMBER: 5432
      DISCOURSE_DATABASE_USER: bn_discourse
      DISCOURSE_DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DISCOURSE_DATABASE_NAME: bitnami_discourse
      DISCOURSE_REDIS_HOST: discourse-redis
      DISCOURSE_REDIS_PORT_NUMBER: 6379
      DISCOURSE_REDIS_PASSWORD: ${REDIS_PASSWORD}
      # Optional: Configure SMTP for email delivery
      # DISCOURSE_SMTP_HOST: ${SMTP_HOST}
      # DISCOURSE_SMTP_PORT: ${SMTP_PORT}
      # DISCOURSE_SMTP_USER: ${SMTP_USER}
      # DISCOURSE_SMTP_PASSWORD: ${SMTP_PASSWORD}
    restart: unless-stopped

volumes:
  discourse-postgresql-data:
  discourse-redis-data:
  discourse-data:
  discourse-sidekiq-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
