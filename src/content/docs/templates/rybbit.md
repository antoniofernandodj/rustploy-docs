---
title: Hospedar Rybbit com Rustploy
description: "Analytics web alternativo focado em ser mais legível e limpo que o Google Analytics clássico. Crie Rybbit em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Rybbit**: Analytics web alternativo focado em ser mais legível e limpo que o Google Analytics clássico. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rybbit` |
| **Containers** | 4 (`rybbit_clickhouse`, `rybbit_postgres`, `rybbit_backend`, `rybbit_client`) |
| **Imagens** | `clickhouse/clickhouse-server:25.5`, `postgres:17.5`, `ghcr.io/rybbit-io/rybbit-backend:v1.5.1`, `ghcr.io/rybbit-io/rybbit-client:v1.5.1` |
| **Porta da interface** | 3001, no serviço `rybbit_backend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Rybbit** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `better_auth_secret` | *senha aleatória de 32 caracteres* |
| `clickhouse_password` | *senha aleatória de 32 caracteres* |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BASE_URL` | http://${main_domain} |
| `DOMAIN_NAME` | ${main_domain} |
| `BETTER_AUTH_SECRET` | ${better_auth_secret} |
| `DISABLE_SIGNUP` | false |
| `CLICKHOUSE_DB` | analytics |
| `CLICKHOUSE_USER` | default |
| `CLICKHOUSE_PASSWORD` | ${clickhouse_password} |
| `POSTGRES_DB` | analytics |
| `POSTGRES_USER` | frog |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `rybbit_backend` | 3001 | ${main_domain} |
| `rybbit_client` | 3002 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./clickhouse_config/enable_json.xml`
- `./clickhouse_config/logging_rules.xml`
- `./clickhouse_config/network.xml`
- `./clickhouse_config/user_logging.xml`

## docker-compose.yml do template

```yaml
# https://www.rybbit.io/docs/self-hosting-advanced

# NOTE: there are two sample HTTP traefik domain entries created:
# - rybbit_backend (port 3001, path /api), 
# - rybbit_client (port 3002, path /)
#
# You should treat these as placeholders - Rybbit only supports HTTPS.
#
# You should also update the `BASE_URL`, and `DOMAIN_NAME` environment
# variable when updating the domain entries with your custom domain.

services:
  rybbit_clickhouse:
    image: clickhouse/clickhouse-server:25.5
    volumes:
      - clickhouse_data:/var/lib/clickhouse
      - ../files/clickhouse_config:/etc/clickhouse-server/config.d
    environment:
      - CLICKHOUSE_DB=${CLICKHOUSE_DB}
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://localhost:8123/ping",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  rybbit_postgres:
    image: postgres:17.5
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  rybbit_backend:
    image: ghcr.io/rybbit-io/rybbit-backend:v1.5.1
    environment:
      - NODE_ENV=production
      - CLICKHOUSE_HOST=http://rybbit_clickhouse:8123
      - CLICKHOUSE_DB=${CLICKHOUSE_DB}
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
      - POSTGRES_HOST=rybbit_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BASE_URL=${BASE_URL}
      - DOMAIN_NAME=${DOMAIN_NAME}
      - DISABLE_SIGNUP=${DISABLE_SIGNUP}
    depends_on:
      rybbit_clickhouse:
        condition: service_healthy
      rybbit_postgres:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://127.0.0.1:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  rybbit_client:
    image: ghcr.io/rybbit-io/rybbit-client:v1.5.1
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BACKEND_URL=${BASE_URL}
      - DOMAIN_NAME=${DOMAIN_NAME}
      - NEXT_PUBLIC_DISABLE_SIGNUP=${DISABLE_SIGNUP}
    depends_on:
      - rybbit_backend
    restart: unless-stopped

volumes:
  clickhouse_data:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
