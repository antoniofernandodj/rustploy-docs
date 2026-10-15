---
title: Hospedar Notifuse com Rustploy
description: "Central open-source para criação, envio e acompanhamento de métricas de newsletters. Crie Notifuse em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Notifuse**: Central open-source para criação, envio e acompanhamento de métricas de newsletters. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `notifuse` |
| **Containers** | 2 (`db`, `notifuse`) |
| **Imagens** | `postgres:17-alpine`, `notifuse/notifuse:latest` |
| **Porta da interface** | 8080, no serviço `notifuse` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Notifuse** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ROOT_EMAIL` | *e-mail gerado* |
| `API_ENDPOINT` | https://${main_domain} |
| `SECRET_KEY` | ${secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `notifuse` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    volumes:
      - db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  notifuse:
    image: notifuse/notifuse:latest
    restart: unless-stopped
    depends_on:
      - db
    environment:
      # Root user configuration
      ROOT_EMAIL: ${ROOT_EMAIL}

      # API configuration
      API_ENDPOINT: ${API_ENDPOINT}

      # Database configuration
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_PREFIX: notifuse
      DB_NAME: postgres
      DB_SSLMODE: disable

      # Secret key for authentication (auto-generated)
      SECRET_KEY: ${SECRET_KEY}

      # Server configuration
      SERVER_PORT: 8080
      SERVER_HOST: 0.0.0.0
      ENVIRONMENT: production
    volumes:
      - notifuse_data:/app/data
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/healthz"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

volumes:
  db_data: {}
  notifuse_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
