---
title: Hospedar Logto com Rustploy
description: "Plataforma CIAM moderna voltada para autenticação de clientes e colaboradores. Crie Logto em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Logto**: Plataforma CIAM moderna voltada para autenticação de clientes e colaboradores. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `logto` |
| **Containers** | 2 (`app`, `postgres`) |
| **Imagens** | `ghcr.io/logto-io/logto:1.27.0`, `postgres:17-alpine` |
| **Porta da interface** | 3001, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Logto** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LOGTO_ENDPOINT` | http://${admin_domain} |
| `LOGTO_ADMIN_ENDPOINT` | http://${admin_domain} |
| `LOGTO_POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 3001 | ${main_domain} |
| `app` | 3002 | ${admin_domain} |

## docker-compose.yml do template

```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy
    image: ghcr.io/logto-io/logto:1.27.0
    entrypoint: ["sh", "-c", "npm run cli db seed -- --swe && npm start"]
    ports:
      - 3001
      - 3002

    environment:
      TRUST_PROXY_HEADER: 1
      DB_URL: postgres://logto:${LOGTO_POSTGRES_PASSWORD}@postgres:5432/logto
      ENDPOINT: ${LOGTO_ENDPOINT}
      ADMIN_ENDPOINT: ${LOGTO_ADMIN_ENDPOINT}
    volumes:
      - logto-connectors:/etc/logto/packages/core/connectors
  postgres:
    image: postgres:17-alpine
    user: postgres

    environment:
      POSTGRES_USER: logto
      POSTGRES_PASSWORD: ${LOGTO_POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5


volumes:
  logto-connectors:
  postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
