---
title: Hospedar N8n Runner Postgres Ollama com Rustploy
description: "Aplicação N8n Runner Postgres Ollama. Crie N8n Runner Postgres Ollama em um clique no Rustploy: 7 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**N8n Runner Postgres Ollama**: Aplicação N8n Runner Postgres Ollama. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `n8n-runner-postgres-ollama` |
| **Containers** | 7 (`n8n`, `n8n-worker`, `n8n-runner`, `ollama`, `init-ollama`, `redis`, `postgres`) |
| **Imagens** | `n8nio/n8n:latest`, `docker.n8n.io/n8nio/n8n:latest`, `n8nio/runners:nightly`, `ollama/ollama:latest`, `redis:7-alpine`, `postgres:17-alpine` |
| **Porta da interface** | 5678, no serviço `n8n` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **N8n Runner Postgres Ollama** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_user` | *usuário gerado* |
| `postgres_password` | *senha aleatória de 24 caracteres* |
| `postgres_db` | n8n |
| `n8n_encryption_key` | *chave base64 aleatória (64 bytes)* |
| `n8n_runner_secret` | *chave base64 aleatória (64 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `N8N_HOST` | ${main_domain} |
| `N8N_PORT` | 5678 |
| `N8N_RUNNERS_SECRET` | ${n8n_runner_secret} |
| `PROXY_HOPS` | 0 |
| `ENCRYPTION_KEY` | ${n8n_encryption_key} |
| `GENERIC_TIMEZONE` | Europe/Berlin |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `OLLAMA_HOST` | http://ollama:11434 |
| `SMTP_HOST` |  |
| `SMTP_PORT` | 587 |
| `SMTP_USER` |  |
| `SMTP_PASS` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `n8n` | 5678 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=https
      # Database
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      # Configuration
      - N8N_DIAGNOSTICS_ENABLED=false
      - N8N_PERSONALIZATION_ENABLED=true
      - N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - N8N_USER_MANAGEMENT_JWT_SECRET
      - N8N_SECURE_COOKIE=true
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=true
      - N8N_PROXY_HOPS=${PROXY_HOPS:-1}
      - WEBHOOK_URL=https://${N8N_HOST}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_TEMPLATES_ENABLED=true
      - N8N_HIRING_BANNER_ENABLED=false
      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true
      # Ollama
      - OLLAMA_HOST=${OLLAMA_HOST:-ollama:11434}
      # Runners
      - N8N_RUNNERS_ENABLED=true
      - N8N_RUNNERS_MODE=external
      - N8N_RUNNERS_BROKER_LISTEN_ADDRESS=0.0.0.0
      - N8N_RUNNERS_AUTH_TOKEN=${N8N_RUNNERS_SECRET}
      - N8N_NATIVE_PYTHON_RUNNER=true
      - N8N_RUNNERS_MAX_CONCURRENCY=50
      # Logging
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=7
      # Redis
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      # Emails
      # - N8N_SMTP_HOST=${SMTP_HOST}
      # - N8N_SMTP_PORT=${SMTP_PORT}
      # - N8N_SMTP_USER=${SMTP_USER}
      # - N8N_SMTP_PASS=${SMTP_PASS}
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  n8n-worker:
    image: docker.n8n.io/n8nio/n8n:latest
    restart: always
    command: worker
    environment:
      - NODE_ENV=production
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=https
      - EXECUTIONS_MODE=queue
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - N8N_SECURE_COOKIE=true
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_BLOCK_ENV_ACCESS_IN_NODE=true
      - N8N_PROXY_HOPS=${PROXY_HOPS}
      - WEBHOOK_URL=https://${N8N_HOST}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
    depends_on:
      - n8n
      - redis

  n8n-runner:
    image: n8nio/runners:nightly
    restart: always
    environment:
      - N8N_RUNNERS_TASK_BROKER_URI=http://n8n:5679
      - N8N_RUNNERS_AUTH_TOKEN=${N8N_RUNNERS_SECRET}
      - N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_RUNNERS_MAX_CONCURRENCY=50
    depends_on:
      - n8n

  ollama:
    image: ollama/ollama:latest
    restart: unless-stopped
    volumes:
      - ollama_storage:/home/node/.ollama
      
  init-ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_storage:/home/node/.ollama
    entrypoint: /bin/sh
    environment:
      - OLLAMA_HOST=ollama:11434
    command:
      - "-c"
      - "sleep 3; ollama pull llama3.2:latest; ollama pull gemma3:latest"

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - redis_storage:/data
      
  postgres:
    image: postgres:17-alpine
    hostname: postgres
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_storage:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h localhost -U ${POSTGRES_USER} -d ${POSTGRES_DB}']
      interval: 5s
      timeout: 5s
      retries: 10
      
volumes:
  n8n_data:
  postgres_storage:
  ollama_storage:
  redis_storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
