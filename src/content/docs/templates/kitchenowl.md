---
title: Hospedar KitchenOwl com Rustploy
description: "Organizador inteligente de receitas culinárias e listas de supermercado. Crie KitchenOwl em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**KitchenOwl**: Organizador inteligente de receitas culinárias e listas de supermercado. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kitchenowl` |
| **Containers** | 2 (`web`, `db`) |
| **Imagens** | `tombursch/kitchenowl:v0.7.1`, `postgres:17` |
| **Porta da interface** | 8080, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **KitchenOwl** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `app_password` | *senha aleatória de 32 caracteres* |
| `db_password` | *senha aleatória de 24 caracteres* |
| `db_user` | kitchenowl |
| `db_name` | kitchenowl |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_SECRET_KEY` | ${app_password} |
| `DB_DRIVER` | postgresql |
| `DB_HOST` | db |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  web:
    image: tombursch/kitchenowl:v0.7.1
    restart: unless-stopped
    environment:
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
      - DB_DRIVER=postgresql
      - DB_HOST=db
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - kitchenowl_files:/data
    depends_on:
      - db

  db:
    image: postgres:17
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - kitchenowl_db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      interval: 30s
      timeout: 60s
      retries: 5
      start_period: 80s

volumes:
  kitchenowl_files: {}
  kitchenowl_db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
