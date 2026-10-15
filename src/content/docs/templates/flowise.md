---
title: Hospedar Flowise com Rustploy
description: "Interface visual no-code para construir e orquestrar cadeias de LLM. Crie Flowise em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Flowise**: Interface visual no-code para construir e orquestrar cadeias de LLM. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `flowise` |
| **Containers** | 3 (`redis`, `flowise`, `flowise-worker`) |
| **Imagens** | `redis:alpine`, `flowiseai/flowise:latest`, `flowiseai/flowise-worker:latest` |
| **Porta da interface** | 3000, no serviço `flowise` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Flowise** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |
| `jwt_refresh_secret` | *senha aleatória de 32 caracteres* |
| `express_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_AUTH_TOKEN_SECRET` | *JWT gerado* |
| `JWT_REFRESH_TOKEN_SECRET` | *JWT gerado* |
| `EXPRESS_SESSION_SECRET` | ${express_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `flowise` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data

  flowise:
    image: flowiseai/flowise:latest
    restart: always
    expose:
      - 3000
    volumes:
      - flowise_data:/root/.flowise
    environment:
      PORT: 3000
      DATABASE_PATH: /root/.flowise
      REDIS_URL: redis://redis:6379
      JWT_AUTH_TOKEN_SECRET: ${JWT_AUTH_TOKEN_SECRET}
      JWT_REFRESH_TOKEN_SECRET: ${JWT_REFRESH_TOKEN_SECRET}
      EXPRESS_SESSION_SECRET: ${EXPRESS_SESSION_SECRET}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/v1/ping"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    entrypoint: /bin/sh -c "sleep 3; flowise start"
    depends_on:
      - redis

  flowise-worker:
    image: flowiseai/flowise-worker:latest
    restart: always
    volumes:
      - flowise_data:/root/.flowise
    environment:
      WORKER_PORT: 5566
      DATABASE_PATH: /root/.flowise
      REDIS_URL: redis://redis:6379
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5566/healthz"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    entrypoint: /bin/sh -c "node /app/healthcheck/healthcheck.js & sleep 5 && pnpm run start-worker"
    depends_on:
      - redis
      - flowise

volumes:
  redis_data:
  flowise_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
