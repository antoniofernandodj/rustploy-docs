---
title: Hospedar Immich com Rustploy
description: "Servidor de backup de alta performance para fotos e vídeos de celulares. Crie Immich em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Immich**: Servidor de backup de alta performance para fotos e vídeos de celulares. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `immich` |
| **Containers** | 4 (`immich-server`, `immich-machine-learning`, `immich-redis`, `immich-database`) |
| **Imagens** | `ghcr.io/immich-app/immich-server:v2.1.0`, `ghcr.io/immich-app/immich-machine-learning:v2.1.0`, `redis:6.2-alpine`, `tensorchord/pgvecto-rs:pg14-v0.3.0` |
| **Porta da interface** | 2283, no serviço `immich-server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Immich** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `db_user` | immich |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `IMMICH_HOST` | ${main_domain} |
| `SERVER_URL` | https://${main_domain} |
| `FRONT_BASE_URL` | https://${main_domain} |
| `DB_HOSTNAME` | immich-database |
| `DB_PORT` | 5432 |
| `DB_USERNAME` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_DATABASE_NAME` | immich |
| `REDIS_HOSTNAME` | immich-redis |
| `REDIS_PORT` | 6379 |
| `REDIS_DBINDEX` | 0 |
| `TZ` | UTC |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `immich-server` | 2283 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.9"

services:
  immich-server:
    image: ghcr.io/immich-app/immich-server:v2.1.0

    volumes:
      - immich-library:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      immich-redis:
        condition: service_healthy
      immich-database:
        condition: service_healthy
    environment:
      PORT: 2283
      SERVER_URL: ${SERVER_URL}
      FRONT_BASE_URL: ${FRONT_BASE_URL}
      # Database Configuration
      DB_HOSTNAME: ${DB_HOSTNAME}
      DB_PORT: ${DB_PORT}
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_DATABASE_NAME: ${DB_DATABASE_NAME}
      # Redis Configuration
      REDIS_HOSTNAME: ${REDIS_HOSTNAME}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_DBINDEX: ${REDIS_DBINDEX}
      # Server Configuration
      TZ: ${TZ}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:2283/server-info/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  immich-machine-learning:
    image: ghcr.io/immich-app/immich-machine-learning:v2.1.0

    volumes:
      - immich-model-cache:/cache
    environment:
      REDIS_HOSTNAME: ${REDIS_HOSTNAME}
      REDIS_PORT: ${REDIS_PORT}
      REDIS_DBINDEX: ${REDIS_DBINDEX}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  immich-redis:
    image: redis:6.2-alpine

    volumes:
      - immich-redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  immich-database:
    image: tensorchord/pgvecto-rs:pg14-v0.3.0

    volumes:
      - immich-postgres:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_DB: immich
      POSTGRES_INITDB_ARGS: '--data-checksums'
    healthcheck:
      test: pg_isready -U ${DB_USERNAME} -d immich || exit 1
      interval: 10s
      timeout: 5s
      retries: 5
    command:
      [
        'postgres',
        '-c',
        'shared_preload_libraries=vectors.so',
        '-c',
        'search_path="$$user", public, vectors',
        '-c',
        'logging_collector=on',
        '-c',
        'max_wal_size=2GB',
        '-c',
        'shared_buffers=512MB',
        '-c',
        'wal_compression=on',
      ]
    restart: always

volumes:
  immich-model-cache:
  immich-postgres:
  immich-library:
  immich-redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
