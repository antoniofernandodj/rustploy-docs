---
title: Hospedar InvoiceShelf com Rustploy
description: "Emissor de faturas e gerenciador financeiro para profissionais autônomos. Crie InvoiceShelf em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**InvoiceShelf**: Emissor de faturas e gerenciador financeiro para profissionais autônomos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `invoiceshelf` |
| **Containers** | 2 (`invoiceshelf-postgres`, `invoiceshelf-app`) |
| **Imagens** | `postgres:15`, `invoiceshelf/invoiceshelf:nightly` |
| **Porta da interface** | 8080, no serviço `invoiceshelf-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **InvoiceShelf** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória* |
| `db_username` | invoiceshelf |
| `db_database` | invoiceshelf |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `INVOICESHELF_HOST` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |
| `DB_USERNAME` | ${db_username} |
| `DB_DATABASE` | ${db_database} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `invoiceshelf-app` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  invoiceshelf-postgres:
    image: postgres:15

    volumes:
      - invoiceshelf-postgres-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=${DB_USERNAME}
      - POSTGRES_DB=${DB_DATABASE}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  invoiceshelf-app:
    image: invoiceshelf/invoiceshelf:nightly

    volumes:
      - invoiceshelf-storage:/var/www/html/storage
    environment:
      - PHP_TZ=UTC
      - TIMEZONE=UTC
      - APP_NAME=InvoiceShelf
      - APP_ENV=production
      - APP_DEBUG=false
      - APP_URL=http://${INVOICESHELF_HOST}
      - DB_CONNECTION=pgsql
      - DB_HOST=invoiceshelf-postgres
      - DB_PORT=5432
      - DB_DATABASE=${DB_DATABASE}
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - CACHE_STORE=file
      - SESSION_DRIVER=file
      - SESSION_LIFETIME=120
      - SESSION_ENCRYPT=true
      - SESSION_PATH=/
      - SESSION_DOMAIN=${INVOICESHELF_HOST}
      - SANCTUM_STATEFUL_DOMAINS=${INVOICESHELF_HOST}
      - STARTUP_DELAY=10
    depends_on:
      invoiceshelf-postgres:
        condition: service_healthy

volumes:
  invoiceshelf-postgres-data:
  invoiceshelf-storage:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
