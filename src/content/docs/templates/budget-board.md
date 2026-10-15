---
title: Hospedar Budget Board com Rustploy
description: "App de orçamento financeiro com backend em PostgreSQL. Crie Budget Board em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Budget Board**: App de orçamento financeiro com backend em PostgreSQL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `budget-board` |
| **Containers** | 3 (`budget-board-server`, `budget-board-client`, `budget-board-db`) |
| **Imagens** | `ghcr.io/teelur/budget-board/server:release`, `ghcr.io/teelur/budget-board/client:release`, `postgres:16` |
| **Porta da interface** | 6253, no serviço `budget-board-client` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Budget Board** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `budget-board-client` | 6253 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  budget-board-server:
    restart: unless-stopped
    image: ghcr.io/teelur/budget-board/server:release

    environment:
      Logging__LogLevel__Default: Information
      CLIENT_URL: http://budget-board-client:6253
      POSTGRES_HOST: budget-board-db
      POSTGRES_DATABASE: budgetboard
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      AUTO_UPDATE_DB: true

    depends_on:
      budget-board-db:
        condition: service_healthy
  budget-board-client:
    restart: unless-stopped
    image: ghcr.io/teelur/budget-board/client:release
    environment:
      VITE_API_URL: http://budget-board-server
      PORT: 6253
    ports:
      - 6253
    depends_on:
      - budget-board-server
  budget-board-db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: budgetboard
    volumes:
      - "../files/db-data:/var/lib/postgresql/data"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d budgetboard"]
      interval: 5s
      timeout: 5s
      retries: 5
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
