---
title: Hospedar useSend com Rustploy
description: "Plataforma aberta para envio massivo e transacional de e-mails (Alternativa ao Resend e Sendgrid). Crie useSend em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**useSend**: Plataforma aberta para envio massivo e transacional de e-mails (Alternativa ao Resend e Sendgrid). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `usesend` |
| **Containers** | 4 (`usesend-db-prod`, `usesend-redis-prod`, `usesend-storage-prod`, `usesend`) |
| **Imagens** | `postgres:16`, `redis:7`, `minio/minio:latest`, `usesend/usesend:latest` |
| **Porta da interface** | 3000, no serviço `usesend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **useSend** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_base` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `REDIS_URL` | redis://usesend-redis-prod:6379 |
| `POSTGRES_USER` | postgres |
| `POSTGRES_PASSWORD` | postgres |
| `POSTGRES_DB` | usesend |
| `DATABASE_URL` | postgresql://postgres:postgres@usesend-db-prod:5432/usesend |
| `NEXTAUTH_URL` | http://localhost:3000 |
| `NEXTAUTH_SECRET` | ${secret_base} |
| `GITHUB_ID` | 'Fill' |
| `GITHUB_SECRET` | 'Fill' |
| `AWS_DEFAULT_REGION` | us-east-1 |
| `AWS_SECRET_KEY` | 'Fill' |
| `AWS_ACCESS_KEY` | 'Fill' |
| `DOCKER_OUTPUT` | 1 |
| `API_RATE_LIMIT` | 1 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `usesend` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
name: usesend-prod

services:
  usesend-db-prod:
    image: postgres:16

    restart: always
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    # ports:
    #   - "5432:5432"
    volumes:
      - database:/var/lib/postgresql/data

  usesend-redis-prod:
    image: redis:7

    restart: always
    # ports:
    #   - "6379:6379"
    volumes:
      - cache:/data
    command: ["redis-server", "--maxmemory-policy", "noeviction"]

  usesend-storage-prod:
    image: minio/minio:latest

    ports:
      - 9002
      - 9001
    volumes:
      - storage:/data
    environment:
      MINIO_ROOT_USER: usesend
      MINIO_ROOT_PASSWORD: password
    entrypoint: sh
    command: -c 'mkdir -p /data/usesend && minio server /data --console-address ":9001" --address ":9002"'

  usesend:
    image: usesend/usesend:latest
    restart: always
    ports:
      - ${PORT:-3000}
    environment:
      - PORT=${PORT:-3000}
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}
      - AWS_SECRET_KEY=${AWS_SECRET_KEY}
      - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
      - GITHUB_ID=${GITHUB_ID}
      - GITHUB_SECRET=${GITHUB_SECRET}
      - REDIS_URL=${REDIS_URL}
      - NEXT_PUBLIC_IS_CLOUD=${NEXT_PUBLIC_IS_CLOUD:-false}
      - API_RATE_LIMIT=${API_RATE_LIMIT:-1}
    depends_on:
      usesend-db-prod:
        condition: service_healthy
      usesend-redis-prod:
        condition: service_started

volumes:
  database:
  cache:
  storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
