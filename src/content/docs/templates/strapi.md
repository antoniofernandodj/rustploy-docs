---
title: Hospedar Strapi com Rustploy
description: "CMS Headless baseado em JavaScript líder de mercado para construção rápida de APIs de conteúdo. Crie Strapi em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Strapi**: CMS Headless baseado em JavaScript líder de mercado para construção rápida de APIs de conteúdo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `strapi` |
| **Containers** | 2 (`strapi`, `strapi_postgres`) |
| **Imagens** | `elestio/strapi-production:v5.33.0`, `postgres:18` |
| **Porta da interface** | 1337, no serviço `strapi` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Strapi** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *senha aleatória de 32 caracteres* |
| `admin_jwt_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `JWT_SECRET` | *JWT gerado* |
| `ADMIN_JWT_SECRET` | ${admin_jwt_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `strapi` | 1337 | ${main_domain} |

## docker-compose.yml do template

```yaml
# Self-host guide:
# - https://strapi.io/blog/how-to-self-host-your-headless-cms-using-docker-compose

services:
  strapi:
    image: elestio/strapi-production:v5.33.0
    environment:
      # https://docs.strapi.io/cms/configurations/environment
      NODE_ENV: production
      STRAPI_TELEMETRY_DISABLED: true
      STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE: en
      FAST_REFRESH: true
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      DATABASE_CLIENT: postgres
      DATABASE_HOST: strapi_postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - strapi_data:/srv/app
    expose:
      - 1337
    depends_on:
      - strapi_postgres
    healthcheck:
      test:
        - CMD
        - wget
        - "-q"
        - "--spider"
        - "http://127.0.0.1:1337"
      start_period: 3s
      interval: 30s
      timeout: 10s
      retries: 5

  strapi_postgres:
    image: postgres:18
    environment:
      POSTGRES_DB: strapi
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - strapi_postgres_data:/var/lib/postgresql
    healthcheck:
      test:
        - CMD-SHELL
        - "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"
      start_period: 3s
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  strapi_data:
  strapi_postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
