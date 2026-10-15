---
title: Hospedar Postiz com Rustploy
description: "Plataforma focada em agendamento, análise e publicação multicanal de conteúdo. Crie Postiz em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Postiz**: Plataforma focada em agendamento, análise e publicação multicanal de conteúdo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `postiz` |
| **Containers** | 3 (`postiz-app`, `postiz-postgres`, `postiz-redis`) |
| **Imagens** | `ghcr.io/gitroomhq/postiz-app:latest`, `postgres:17-alpine`, `redis:7.2` |
| **Porta da interface** | 5000, no serviço `postiz-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Postiz** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `db_user` | postiz |
| `db_name` | postiz |
| `jwt_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTIZ_HOST` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |
| `DB_USER` | ${db_user} |
| `DB_NAME` | ${db_name} |
| `JWT_SECRET` | *JWT gerado* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `postiz-app` | 5000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  postiz-app:
    image: ghcr.io/gitroomhq/postiz-app:latest
    restart: always

    environment:
      MAIN_URL: "https://${POSTIZ_HOST}"
      FRONTEND_URL: "https://${POSTIZ_HOST}"
      NEXT_PUBLIC_BACKEND_URL: "https://${POSTIZ_HOST}/api"
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: "postgresql://${DB_USER}:${DB_PASSWORD}@postiz-postgres:5432/${DB_NAME}"
      REDIS_URL: "redis://postiz-redis:6379"
      BACKEND_INTERNAL_URL: "http://localhost:3000"
      IS_GENERAL: "true"
      STORAGE_PROVIDER: "local"
      UPLOAD_DIRECTORY: "/uploads"
      NEXT_PUBLIC_UPLOAD_DIRECTORY: "/uploads"
    volumes:
      - postiz-config:/config/
      - postiz-uploads:/uploads/
    depends_on:
      postiz-postgres:
        condition: service_healthy
      postiz-redis:
        condition: service_healthy

  postiz-postgres:
    image: postgres:17-alpine
    restart: always

    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postiz-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: pg_isready -U ${DB_USER} -d ${DB_NAME}
      interval: 10s
      timeout: 3s
      retries: 3

  postiz-redis:
    image: redis:7.2
    restart: always

    healthcheck:
      test: redis-cli ping
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - postiz-redis-data:/data

volumes:
  postiz-postgres-data:
  postiz-redis-data:
  postiz-config:
  postiz-uploads:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
