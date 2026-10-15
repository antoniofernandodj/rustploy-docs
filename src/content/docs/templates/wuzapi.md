---
title: Hospedar WuzAPI com Rustploy
description: "API RESTful leve para integração e automação multi-dispositivo com contas de WhatsApp. Crie WuzAPI em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**WuzAPI**: API RESTful leve para integração e automação multi-dispositivo com contas de WhatsApp. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `wuzapi` |
| **Containers** | 2 (`wuzapi-server`, `db`) |
| **Imagens** | `asternic/wuzapi:sha-30c1805`, `postgres:16-alpine` |
| **Porta da interface** | 8080, no serviço `wuzapi-server` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **WuzAPI** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_token` | *senha aleatória de 32 caracteres* |
| `encryption_key` | *senha aleatória de 32 caracteres* |
| `db_user` | wuzapi |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_name` | wuzapi |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `WUZAPI_ADMIN_TOKEN` | ${admin_token} |
| `WUZAPI_GLOBAL_ENCRYPTION_KEY` | ${encryption_key} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_NAME` | ${db_name} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `wuzapi-server` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  wuzapi-server:
    image: asternic/wuzapi:sha-30c1805
    restart: unless-stopped
    expose:
      - 8080
    environment:
      - WUZAPI_ADMIN_TOKEN=${WUZAPI_ADMIN_TOKEN}
      - WUZAPI_GLOBAL_ENCRYPTION_KEY=${WUZAPI_GLOBAL_ENCRYPTION_KEY}
      - DB_USER=${DB_USER:-wuzapi}
      - DB_PASSWORD=${DB_PASSWORD:-wuzapi}
      - DB_NAME=${DB_NAME:-wuzapi}
      - DB_HOST=db
      - DB_PORT=5432
      - TZ=${TZ:-UTC}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER:-wuzapi}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-wuzapi}
      POSTGRES_DB: ${DB_NAME:-wuzapi}
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${DB_USER:-wuzapi}"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  db_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
