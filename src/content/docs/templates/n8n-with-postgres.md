---
title: Hospedar N8n With Postgres com Rustploy
description: "Aplicação N8n With Postgres. Crie N8n With Postgres em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**N8n With Postgres**: Aplicação N8n With Postgres. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `n8n-with-postgres` |
| **Containers** | 2 (`postgres`, `n8n`) |
| **Imagens** | `postgres:17-alpine`, `n8nio/n8n:latest` |
| **Porta da interface** | 5678, no serviço `n8n` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **N8n With Postgres** e selecione.
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

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `N8N_HOST` | ${main_domain} |
| `N8N_PORT` | 5678 |
| `GENERIC_TIMEZONE` | Europe/Berlin |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |
| `N8N_ENCRYPTION_KEY` | ${n8n_encryption_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `n8n` | 5678 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      start_period: 30s
      interval: 10s
      timeout: 5s
      retries: 5

  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    environment:
      # Configuration PostgreSQL
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      
      # SÉCURITÉ - Encryption (IMPORTANT)
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      
      # Configuration réseau
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=https://${N8N_HOST}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_SECURE_COOKIE=false
      
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  n8n_data:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
