---
title: Hospedar Windmill com Rustploy
description: "Plataforma para desenvolvedores criarem fluxos de trabalho internos robustos baseados em scripts (Alternativa ao Retool). Crie Windmill em um clique no Rustploy: 6 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Windmill**: Plataforma para desenvolvedores criarem fluxos de trabalho internos robustos baseados em scripts (Alternativa ao Retool). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `windmill` |
| **Containers** | 6 (`windmill-postgres`, `windmill-server`, `windmill-worker`, `windmill-worker-native`, `windmill-lsp`, `windmill-caddy`) |
| **Imagens** | `postgres:16`, `ghcr.io/windmill-labs/windmill:main`, `ghcr.io/windmill-labs/windmill-lsp:latest`, `ghcr.io/windmill-labs/caddy-l4:latest` |
| **Porta da interface** | 80, no serviço `windmill-caddy` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Windmill** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `WINDMILL_HOST` | ${main_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `DATABASE_URL` | postgres://postgres:${postgres_password}@windmill-postgres/windmill?sslmode=disable |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `windmill-caddy` | 80 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `Caddyfile`

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  windmill-postgres:
    image: postgres:16
    shm_size: 1g
    restart: unless-stopped
    volumes:
      - windmill-postgres-data:/var/lib/postgresql/data

    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: windmill
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  windmill-server:
    image: ghcr.io/windmill-labs/windmill:main

    restart: unless-stopped
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MODE=server
      - BASE_URL=http://${WINDMILL_HOST}
    depends_on:
      windmill-postgres:
        condition: service_healthy
    volumes:
      - windmill-worker-logs:/tmp/windmill/logs

  windmill-worker:
    image: ghcr.io/windmill-labs/windmill:main
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "1"
          memory: 2048M
    restart: unless-stopped

    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MODE=worker
      - WORKER_GROUP=default
    depends_on:
      windmill-postgres:
        condition: service_healthy
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - windmill-worker-cache:/tmp/windmill/cache
      - windmill-worker-logs:/tmp/windmill/logs

  windmill-worker-native:
    image: ghcr.io/windmill-labs/windmill:main
    deploy:
      replicas: 1
      resources:
        limits:
          cpus: "0.1"
          memory: 128M
    restart: unless-stopped

    environment:
      - DATABASE_URL=${DATABASE_URL}
      - MODE=worker
      - WORKER_GROUP=native
      - NUM_WORKERS=8
      - SLEEP_QUEUE=200
    depends_on:
      windmill-postgres:
        condition: service_healthy
    volumes:
      - windmill-worker-logs:/tmp/windmill/logs

  windmill-lsp:
    image: ghcr.io/windmill-labs/windmill-lsp:latest
    restart: unless-stopped

    volumes:
      - windmill-lsp-cache:/root/.cache

  windmill-caddy:
    image: ghcr.io/windmill-labs/caddy-l4:latest
    restart: unless-stopped

    volumes:
      - ../files/Caddyfile:/etc/caddy/Caddyfile
    environment:
      - BASE_URL=":80"
    depends_on:
      - windmill-server
      - windmill-lsp


volumes:
  windmill-postgres-data:
  windmill-worker-cache:
  windmill-worker-logs:
  windmill-lsp-cache:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
