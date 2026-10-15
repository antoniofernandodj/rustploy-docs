---
title: Hospedar Glitchtip com Rustploy
description: "Coletor centralizado e simplificado de erros de aplicações (Alternativa ao Sentry). Crie Glitchtip em um clique no Rustploy: 5 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Glitchtip**: Coletor centralizado e simplificado de erros de aplicações (Alternativa ao Sentry). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `glitchtip` |
| **Containers** | 5 (`postgres`, `redis`, `web`, `worker`, `migrate`) |
| **Imagens** | `postgres:16`, `redis`, `glitchtip/glitchtip:v4.0` |
| **Porta da interface** | 8000, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Glitchtip** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `GLITCHTIP_HOST` | ${main_domain} |
| `GLITCHTIP_PORT` | 8000 |
| `SECRET_KEY` | ${secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
x-environment: &default-environment
  DATABASE_URL: postgres://postgres:postgres@postgres:5432/postgres
  SECRET_KEY: ${SECRET_KEY}
  PORT: ${GLITCHTIP_PORT}
  EMAIL_URL: consolemail://
  GLITCHTIP_DOMAIN: http://${GLITCHTIP_HOST}
  DEFAULT_FROM_EMAIL: email@glitchtip.com
  CELERY_WORKER_AUTOSCALE: "1,3"
  CELERY_WORKER_MAX_TASKS_PER_CHILD: "10000"

x-depends_on: &default-depends_on
  - postgres
  - redis

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_HOST_AUTH_METHOD: "trust"
    restart: unless-stopped
    volumes:
      - pg-data:/var/lib/postgresql/data

  redis:
    image: redis
    restart: unless-stopped

  web:
    image: glitchtip/glitchtip:v4.0
    depends_on: *default-depends_on
    ports:
      - ${GLITCHTIP_PORT}
    environment: *default-environment
    restart: unless-stopped
    volumes:
      - uploads:/code/uploads
  worker:
    image: glitchtip/glitchtip:v4.0
    command: ./bin/run-celery-with-beat.sh
    depends_on: *default-depends_on
    environment: *default-environment
    restart: unless-stopped
    volumes:
      - uploads:/code/uploads

  migrate:
    image: glitchtip/glitchtip:v4.0
    depends_on: *default-depends_on
    command: "./manage.py migrate"
    environment: *default-environment


volumes:
  pg-data:
  uploads:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
