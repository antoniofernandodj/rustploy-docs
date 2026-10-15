---
title: Hospedar Stack Auth com Rustploy
description: "Provedor de autenticação de usuários simplificado (Alternativa aberta ao Clerk/Auth0). Crie Stack Auth em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Stack Auth**: Provedor de autenticação de usuários simplificado (Alternativa aberta ao Clerk/Auth0). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `stack-auth` |
| **Containers** | 2 (`stack-auth-db`, `stack-auth`) |
| **Imagens** | `postgres:17`, `stackauth/server:latest` |
| **Porta da interface** | 8102, no serviço `stack-auth` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Stack Auth** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `dashboard_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `stack_auth_api_url` | ${api_domain} |
| `stack_auth_dashboard_url` | ${dashboard_domain} |
| `stack_auth_postgres_host` | stack-auth-db |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_USER` | postgres |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | stackframe |
| `NEXT_PUBLIC_STACK_API_URL` | http://${stack_auth_api_url} |
| `NEXT_PUBLIC_STACK_DASHBOARD_URL` | http://${stack_auth_dashboard_url} |
| `STACK_DATABASE_CONNECTION_STRING` | postgres://postgres:${postgres_password}@${stack_auth_postgres_host}/stackframe |
| `STACK_DIRECT_DATABASE_CONNECTION_STRING` | postgres://postgres:${postgres_password}@${stack_auth_postgres_host}/stackframe |
| `STACK_SERVER_SECRET` | *senha aleatória de 64 caracteres* |
| `STACK_SEED_INTERNAL_PROJECT_ALLOW_LOCALHOST` | true |
| `STACK_SEED_INTERNAL_PROJECT_SIGN_UP_ENABLED` | true |
| `STACK_RUN_MIGRATIONS` | true |
| `STACK_RUN_SEED_SCRIPT` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `stack-auth` | 8102 | ${stack_auth_api_url} |
| `stack-auth` | 8101 | ${stack_auth_dashboard_url} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  stack-auth-db:
    image: postgres:17
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - stack-auth-db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready", "-d", "db_prod"]
      interval: 10s
      timeout: 60s
      retries: 5
      start_period: 80s
      
  stack-auth:
    image: stackauth/server:latest
    container_name: stack-auth
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
      - NEXT_PUBLIC_STACK_API_URL=${NEXT_PUBLIC_STACK_API_URL}
      - NEXT_PUBLIC_STACK_DASHBOARD_URL=${NEXT_PUBLIC_STACK_DASHBOARD_URL}
      - STACK_DATABASE_CONNECTION_STRING=${STACK_DATABASE_CONNECTION_STRING}
      - STACK_DIRECT_DATABASE_CONNECTION_STRING=${STACK_DIRECT_DATABASE_CONNECTION_STRING}
      - STACK_SERVER_SECRET=${STACK_SERVER_SECRET}
      - STACK_SEED_INTERNAL_PROJECT_ALLOW_LOCALHOST=${STACK_SEED_INTERNAL_PROJECT_ALLOW_LOCALHOST}
      - STACK_SEED_INTERNAL_PROJECT_SIGN_UP_ENABLED=${STACK_SEED_INTERNAL_PROJECT_SIGN_UP_ENABLED}
      - STACK_RUN_MIGRATIONS=${STACK_RUN_MIGRATIONS}
      - STACK_RUN_SEED_SCRIPT=${STACK_RUN_SEED_SCRIPT}
      - STACK_EMAIL_HOST=${STACK_EMAIL_HOST}
    depends_on:
      stack-auth-db:
        condition: service_healthy

    
volumes:
  stack-auth-db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
