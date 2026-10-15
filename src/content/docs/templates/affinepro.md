---
title: Hospedar Affine Pro com Rustploy
description: "Plataforma de notas e gerenciamento de projetos colaborativos (Estilo Notion/Miro). Crie Affine Pro em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Affine Pro**: Plataforma de notas e gerenciamento de projetos colaborativos (Estilo Notion/Miro). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `affinepro` |
| **Containers** | 4 (`affinepro`, `migration`, `db`, `redis`) |
| **Imagens** | `ghcr.io/toeverything/affine-graphql:stable-780dd83`, `postgres:15-alpine`, `redis:7-alpine` |
| **Porta da interface** | 3010, no serviço `affinepro` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Affine Pro** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 16 caracteres* |
| `redis_password` | *senha aleatória de 16 caracteres* |
| `mailer_host` |  |
| `mailer_port` | 587 |
| `mailer_user` |  |
| `mailer_password` |  |
| `mailer_sender` |  |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `MAILER_HOST` | ${mailer_host} |
| `MAILER_PORT` | ${mailer_port} |
| `MAILER_USER` | ${mailer_user} |
| `MAILER_PASSWORD` | ${mailer_password} |
| `MAILER_SENDER` | ${mailer_sender} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `affinepro` | 3010 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  affinepro:
    image: ghcr.io/toeverything/affine-graphql:stable-780dd83
    restart: unless-stopped
    ports:
      - 3010
    volumes:
      - affine-storage:/root/.affine/storage
      - affine-config:/root/.affine/config
    environment:
      - REDIS_SERVER_HOST=redis
      - REDIS_SERVER_PASSWORD=${REDIS_PASSWORD}
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/affinepro
      - AFFINE_SERVER_HOST=${DOMAIN}
      - MAILER_HOST=${MAILER_HOST}
      - MAILER_PORT=${MAILER_PORT}
      - MAILER_USER=${MAILER_USER}
      - MAILER_PASSWORD=${MAILER_PASSWORD}
      - MAILER_SENDER=${MAILER_SENDER}
    depends_on:
      - db
      - redis

  migration:
    image: ghcr.io/toeverything/affine-graphql:stable-780dd83
    command: node ./scripts/self-host-predeploy.js
    environment:
      - REDIS_SERVER_HOST=redis
      - REDIS_SERVER_PASSWORD=${REDIS_PASSWORD}
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/affinepro
      - AFFINE_SERVER_HOST=${DOMAIN}
      - MAILER_HOST=${MAILER_HOST}
      - MAILER_PORT=${MAILER_PORT}
      - MAILER_USER=${MAILER_USER}
      - MAILER_PASSWORD=${MAILER_PASSWORD}
      - MAILER_SENDER=${MAILER_SENDER}
    volumes:
      - affine-storage:/root/.affine/storage
      - affine-config:/root/.affine/config
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=affinepro
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data

volumes:
  affine-storage: {}
  affine-config: {}
  postgres-data: {}
  redis-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
