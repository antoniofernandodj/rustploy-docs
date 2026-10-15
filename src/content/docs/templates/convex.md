---
title: Hospedar Convex com Rustploy
description: "Banco de dados reativo para facilitar o desenvolvimento de aplicações web de tempo real. Crie Convex em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Convex**: Banco de dados reativo para facilitar o desenvolvimento de aplicações web de tempo real. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `convex` |
| **Containers** | 2 (`backend`, `dashboard`) |
| **Imagens** | `ghcr.io/get-convex/convex-backend:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f`, `ghcr.io/get-convex/convex-dashboard:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f` |
| **Porta da interface** | 6791, no serviço `dashboard` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Convex** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `dashboard_domain` | *domínio (gerado; troque pelo seu)* |
| `backend_domain` | *domínio (gerado; troque pelo seu)* |
| `actions_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_DEPLOYMENT_URL` | http://${backend_domain} |
| `CONVEX_CLOUD_ORIGIN` | http://${backend_domain} |
| `CONVEX_SITE_ORIGIN` | http://${actions_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `dashboard` | 6791 | ${dashboard_domain} |
| `backend` | 3210 | ${backend_domain} |
| `backend` | 3211 | ${actions_domain} |

## docker-compose.yml do template

```yaml
services:
  backend:
    image: ghcr.io/get-convex/convex-backend:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f
    expose:
      - "3210"
      - "3211"
    volumes:
      - data:/convex/data
    environment:
      - INSTANCE_NAME=${INSTANCE_NAME:-}
      - INSTANCE_SECRET=${INSTANCE_SECRET:-}
      - CONVEX_RELEASE_VERSION_DEV=${CONVEX_RELEASE_VERSION_DEV:-}
      - ACTIONS_USER_TIMEOUT_SECS=${ACTIONS_USER_TIMEOUT_SECS:-}
      - CONVEX_CLOUD_ORIGIN=${CONVEX_CLOUD_ORIGIN:-http://127.0.0.1:3210}
      - CONVEX_SITE_ORIGIN=${CONVEX_SITE_ORIGIN:-http://127.0.0.1:3211}
      - DATABASE_URL=${DATABASE_URL:-}
      - DISABLE_BEACON=${DISABLE_BEACON:-FALSE}
      - REDACT_LOGS_TO_CLIENT=${REDACT_LOGS_TO_CLIENT:-}
      - RUST_LOG=${RUST_LOG:-info}
      - RUST_BACKTRACE=${RUST_BACKTRACE:-}
    healthcheck:
      test: curl -f http://localhost:3210/version
      interval: 5s
      start_period: 5s

  dashboard:
    image: ghcr.io/get-convex/convex-dashboard:5cdea511cd6527a95dd24152ea0d3c3bb2ab379f
    expose:
      - "6791"
    environment:
      - NEXT_PUBLIC_DEPLOYMENT_URL=${NEXT_PUBLIC_DEPLOYMENT_URL:-http://127.0.0.1:3210}
    depends_on:
      backend:
        condition: service_healthy

volumes:
  data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
