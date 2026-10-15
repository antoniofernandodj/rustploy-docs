---
title: Hospedar Ryot com Rustploy
description: "Sistema unificado para registrar e catalogar mídias consumidas (Livros, Filmes, Jogos). Crie Ryot em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ryot**: Sistema unificado para registrar e catalogar mídias consumidas (Livros, Filmes, Jogos). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ryot` |
| **Containers** | 2 (`ryot-app`, `ryot-db`) |
| **Imagens** | `ignisda/ryot:v7.10`, `postgres:16-alpine` |
| **Porta da interface** | 8000, no serviço `ryot-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ryot** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `admin_access_token` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ADMIN_ACCESS_TOKEN` | ${admin_access_token} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ryot-app` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.7'

services:
  ryot-app:
    image: ignisda/ryot:v7.10

    environment:
      - DATABASE_URL=postgres://postgres:${POSTGRES_PASSWORD}@ryot-db:5432/postgres
      - SERVER_ADMIN_ACCESS_TOKEN=${ADMIN_ACCESS_TOKEN}
      - TZ=UTC
      # Optional: Uncomment and set your pro key if you have one
      # - SERVER_PRO_KEY=${SERVER_PRO_KEY}
    depends_on:
      ryot-db:
        condition: service_healthy
    restart: always
    pull_policy: always

  ryot-db:
    image: postgres:16-alpine

    volumes:
      - ryot-postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=postgres
      - POSTGRES_DB=postgres
      - TZ=UTC
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  ryot-postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
