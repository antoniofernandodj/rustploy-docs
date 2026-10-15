---
title: Hospedar Postgres Pgdog com Rustploy
description: "Aplicação Postgres Pgdog. Crie Postgres Pgdog em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Postgres Pgdog**: Aplicação Postgres Pgdog. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `postgres-pgdog` |
| **Containers** | 2 (`postgres-pgdog`, `postgres`) |
| **Imagens** | `${PGDOG_IMAGE}`, `${POSTGRES_IMAGE}` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Postgres Pgdog** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `postgres_user` | *usuário gerado* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `postgres_db` | postgres |
| `pgdog_image` | ghcr.io/pgdogdev/pgdog:v0.1.26 |
| `postgres_image` | postgres:18-alpine |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |
| `PGDOG_IMAGE` | ${pgdog_image} |
| `POSTGRES_IMAGE` | ${postgres_image} |
| `RUST_LOG` | info |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `pgdog.toml`
- `users.toml`

## docker-compose.yml do template

```yaml
services:
  postgres-pgdog:
    image: ${PGDOG_IMAGE}
    restart: unless-stopped
    # Uncomment 'ports' settings below to enable external access
    # ports:
    #   - "6432:6432"
    volumes:
      - ../files/pgdog.toml:/pgdog/pgdog.toml
      - ../files/users.toml:/pgdog/users.toml
    environment:
      - RUST_LOG=${RUST_LOG}
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: ${POSTGRES_IMAGE}
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres-data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
