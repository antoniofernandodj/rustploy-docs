---
title: Hospedar Slash com Rustploy
description: "Encurtador interno rápido feito para organizar caminhos de links favoritos. Crie Slash em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Slash**: Encurtador interno rápido feito para organizar caminhos de links favoritos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `slash` |
| **Containers** | 2 (`slash-app`, `slash-postgres`) |
| **Imagens** | `yourselfhosted/slash:latest`, `postgres:16-alpine` |
| **Porta da interface** | 5231, no serviço `slash-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Slash** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `db_user` | slash |
| `db_name` | slash |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_NAME` | ${db_name} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `slash-app` | 5231 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  slash-app:
    image: yourselfhosted/slash:latest

    volumes:
      - slash-app-data:/var/opt/slash
    environment:
      - SLASH_DRIVER=postgres
      - SLASH_DSN=postgresql://${DB_USER}:${DB_PASSWORD}@slash-postgres:5432/${DB_NAME}?sslmode=disable
    depends_on:
      slash-postgres:
        condition: service_healthy
    restart: unless-stopped

  slash-postgres:
    image: postgres:16-alpine

    volumes:
      - slash-postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  slash-app-data:
  slash-postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
