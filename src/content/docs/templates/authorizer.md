---
title: Hospedar Authorizer com Rustploy
description: "Solução low-code de autenticação e autorização de usuários. Crie Authorizer em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Authorizer**: Solução low-code de autenticação e autorização de usuários. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `authorizer` |
| **Containers** | 3 (`authorizer`, `authorizer-db`, `authorizer-redis`) |
| **Imagens** | `lakhansamani/authorizer:1.4.4`, `postgres:15-alpine`, `redis:7-alpine` |
| **Porta da interface** | 8080, no serviço `authorizer` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Authorizer** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `admin_secret` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `ADMIN_SECRET` | ${admin_secret} |
| `JWT_SECRET` | *JWT gerado* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `authorizer` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  authorizer:
    image: lakhansamani/authorizer:1.4.4
    restart: unless-stopped
    ports:
      - 8080
    environment:
      - DATABASE_TYPE=postgres
      - DATABASE_URL=postgres://postgres:${DB_PASSWORD}@authorizer-db:5432/authorizer?sslmode=disable
      - REDIS_URL=redis://authorizer-redis:6379
      - ADMIN_SECRET=${ADMIN_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - COOKIE_NAME=authorizer
      - ACCESS_TOKEN_EXPIRY_TIME=86400
      - REFRESH_TOKEN_EXPIRY_TIME=86400
      - DISABLE_PLAYGROUND=true
    depends_on:
      - authorizer-db
      - authorizer-redis

  authorizer-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=authorizer
    volumes:
      - db_data:/var/lib/postgresql/data

  authorizer-redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  db_data: {}
  redis_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
