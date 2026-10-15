---
title: Hospedar Automatisch com Rustploy
description: "Aplicação Automatisch. Crie Automatisch em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Automatisch**: Aplicação Automatisch. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `automatisch` |
| **Containers** | 4 (`automatisch`, `automatisch-worker`, `automatisch-postgres`, `automatisch-redis`) |
| **Imagens** | `dockeriddonuts/automatisch:2.0`, `postgres:15-alpine`, `redis:7-alpine` |
| **Porta da interface** | 3000, no serviço `automatisch` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Automatisch** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `redis_password` | *senha aleatória de 16 caracteres* |
| `encryption_key` | *senha aleatória de 32 caracteres* |
| `webhook_secret_key` | *senha aleatória de 32 caracteres* |
| `app_secret_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `ENCRYPTION_KEY` | ${encryption_key} |
| `WEBHOOK_SECRET_KEY` | ${webhook_secret_key} |
| `APP_SECRET_KEY` | ${app_secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `automatisch` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  automatisch:
    image: dockeriddonuts/automatisch:2.0
    restart: unless-stopped
    ports:
      - 3000
    environment:
      - HOST=${DOMAIN}
      - PROTOCOL=http
      - PORT=3000
      - APP_ENV=production
      - REDIS_HOST=automatisch-redis
      - REDIS_USERNAME=default
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - POSTGRES_HOST=automatisch-postgres
      - POSTGRES_DATABASE=automatisch
      - POSTGRES_USERNAME=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - WEBHOOK_SECRET_KEY=${WEBHOOK_SECRET_KEY}
      - APP_SECRET_KEY=${APP_SECRET_KEY}
    volumes:
      - storage:/automatisch/storage
    depends_on:
      - automatisch-postgres
      - automatisch-redis

  automatisch-worker:
    image: dockeriddonuts/automatisch:2.0
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - REDIS_HOST=automatisch-redis
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - POSTGRES_HOST=automatisch-postgres
      - POSTGRES_DATABASE=automatisch
      - POSTGRES_USERNAME=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - WEBHOOK_SECRET_KEY=${WEBHOOK_SECRET_KEY}
      - APP_SECRET_KEY=${APP_SECRET_KEY}
      - WORKER=true
    volumes:
      - storage:/automatisch/storage
    depends_on:
      - automatisch-postgres
      - automatisch-redis

  automatisch-postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=automatisch
    volumes:
      - postgres_data:/var/lib/postgresql/data

  automatisch-redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    environment:
      - REDIS_USERNAME=default
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

volumes:
  storage: {}
  postgres_data: {}
  redis_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
