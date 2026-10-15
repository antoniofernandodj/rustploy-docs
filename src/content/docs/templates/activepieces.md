---
title: Hospedar Activepieces com Rustploy
description: "Automação no-code (Alternativa ao Zapier e Make). Crie Activepieces em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Activepieces**: Automação no-code (Alternativa ao Zapier e Make). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `activepieces` |
| **Containers** | 3 (`activepieces`, `postgres`, `redis`) |
| **Imagens** | `activepieces/activepieces:0.35.0`, `postgres:14`, `redis:7` |
| **Porta da interface** | 80, no serviço `activepieces` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Activepieces** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_key` | *senha aleatória de 32 caracteres* |
| `encryption_key` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `AP_HOST` | ${main_domain} |
| `AP_API_KEY` | ${api_key} |
| `AP_ENCRYPTION_KEY` | ${encryption_key} |
| `AP_JWT_SECRET` | *JWT gerado* |
| `AP_POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `activepieces` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  activepieces:
    image: activepieces/activepieces:0.35.0
    restart: unless-stopped

    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      AP_ENGINE_EXECUTABLE_PATH: dist/packages/engine/main.js
      AP_API_KEY: ${AP_API_KEY}
      AP_ENCRYPTION_KEY: ${AP_ENCRYPTION_KEY}
      AP_JWT_SECRET: ${AP_JWT_SECRET}
      AP_ENVIRONMENT: prod
      AP_FRONTEND_URL: https://${AP_HOST}
      AP_WEBHOOK_TIMEOUT_SECONDS: 30
      AP_TRIGGER_DEFAULT_POLL_INTERVAL: 5
      AP_POSTGRES_DATABASE: activepieces
      AP_POSTGRES_HOST: postgres
      AP_POSTGRES_PORT: 5432
      AP_POSTGRES_USERNAME: activepieces
      AP_POSTGRES_PASSWORD: ${AP_POSTGRES_PASSWORD}
      AP_EXECUTION_MODE: UNSANDBOXED
      AP_REDIS_HOST: redis
      AP_REDIS_PORT: 6379
      AP_SANDBOX_RUN_TIME_SECONDS: 600
      AP_TELEMETRY_ENABLED: "false"
      AP_TEMPLATES_SOURCE_URL: https://cloud.activepieces.com/api/v1/flow-templates

  postgres:
    image: postgres:14
    restart: unless-stopped

    environment:
      POSTGRES_DB: activepieces
      POSTGRES_PASSWORD: ${AP_POSTGRES_PASSWORD}
      POSTGRES_USER: activepieces
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U activepieces -d activepieces"]
      interval: 30s
      timeout: 30s
      retries: 3

  redis:
    image: redis:7
    restart: unless-stopped

    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 30s
      retries: 3

volumes:
  postgres_data:
  redis_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
