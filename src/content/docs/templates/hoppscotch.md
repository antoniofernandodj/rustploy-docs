---
title: Hospedar Hoppscotch com Rustploy
description: "Aplicação Hoppscotch. Crie Hoppscotch em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Hoppscotch**: Aplicação Hoppscotch. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `hoppscotch` |
| **Containers** | 3 (`hoppscotch`, `postgres`, `migrate`) |
| **Imagens** | `hoppscotch/hoppscotch:latest`, `postgres:16` |
| **Porta da interface** | 80, no serviço `hoppscotch` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Hoppscotch** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `encryption_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_DB` | hoppscotch |
| `POSTGRES_USER` | hoppscotch |
| `POSTGRES_PASSWORD` | ${db_password} |
| `DATABASE_URL` | postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB} |
| `DATA_ENCRYPTION_KEY` | ${encryption_key} |
| `HOPP_AIO_ALTERNATE_PORT` | 80 |
| `WHITELISTED_ORIGINS` | https://${main_domain},http://${main_domain},app://hoppscotch |
| `VITE_BASE_URL` | https://${main_domain} |
| `VITE_SHORTCODE_BASE_URL` | https://${main_domain} |
| `VITE_ADMIN_URL` | https://${main_domain}/admin |
| `VITE_BACKEND_GQL_URL` | https://${main_domain}/backend/graphql |
| `VITE_BACKEND_WS_URL` | wss://${main_domain}/backend/graphql |
| `VITE_BACKEND_API_URL` | https://${main_domain}/backend/v1 |
| `VITE_APP_TOS_LINK` | https://docs.hoppscotch.io/support/terms |
| `VITE_APP_PRIVACY_POLICY_LINK` | https://docs.hoppscotch.io/support/privacy |
| `ENABLE_SUBPATH_BASED_ACCESS` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `hoppscotch` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  hoppscotch:
    image: hoppscotch/hoppscotch:latest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    expose:
      - 80
    environment:
      # Database
      DATABASE_URL: "${DATABASE_URL}"
      DATA_ENCRYPTION_KEY: "${DATA_ENCRYPTION_KEY}"
      HOPP_AIO_ALTERNATE_PORT: "${HOPP_AIO_ALTERNATE_PORT}"
      WHITELISTED_ORIGINS: "${WHITELISTED_ORIGINS}"

      # Frontend config
      VITE_BASE_URL: "${VITE_BASE_URL}"
      VITE_SHORTCODE_BASE_URL: "${VITE_SHORTCODE_BASE_URL}"
      VITE_ADMIN_URL: "${VITE_ADMIN_URL}"

      # Backend config
      VITE_BACKEND_GQL_URL: "${VITE_BACKEND_GQL_URL}"
      VITE_BACKEND_WS_URL: "${VITE_BACKEND_WS_URL}"
      VITE_BACKEND_API_URL: "${VITE_BACKEND_API_URL}"

      # Optional UI links
      VITE_APP_TOS_LINK: "${VITE_APP_TOS_LINK}"
      VITE_APP_PRIVACY_POLICY_LINK: "${VITE_APP_PRIVACY_POLICY_LINK}"

      # Subpath access
      ENABLE_SUBPATH_BASED_ACCESS: "true"

    volumes:
      - hoppscotch-data:/app/data

  postgres:
    image: postgres:16
    restart: unless-stopped
    expose:
      - 5432
    environment:
      POSTGRES_DB: "${POSTGRES_DB}"
      POSTGRES_USER: "${POSTGRES_USER}"
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
    volumes:
      - hoppscotch-postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  migrate:
    image: hoppscotch/hoppscotch:latest
    depends_on:
      postgres:
        condition: service_healthy
    entrypoint: ["/bin/sh", "-c"]
    command:
      - |
        echo "Running database migrations..."
        pnpm dlx prisma migrate deploy && echo "Migration complete!"
    environment:
      DATABASE_URL: "${DATABASE_URL}"
    restart: "no"

volumes:
  hoppscotch-data:
  hoppscotch-postgres:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
