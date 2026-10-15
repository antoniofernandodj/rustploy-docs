---
title: Hospedar Directus com Rustploy
description: "CMS Headless e wrapper instantâneo de APIs para SQL. Crie Directus em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Directus**: CMS Headless e wrapper instantâneo de APIs para SQL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `directus` |
| **Containers** | 3 (`database`, `cache`, `directus`) |
| **Imagens** | `postgis/postgis:13-master`, `redis:6`, `directus/directus:11.12.0` |
| **Porta da interface** | 8055, no serviço `directus` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Directus** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `directus_secret` | *chave base64 aleatória (64 bytes)* |
| `database_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DATABASE_PASSWORD` | ${database_password} |
| `DIRECTUS_SECRET` | ${directus_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `directus` | 8055 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  database:
    image: postgis/postgis:13-master
    volumes:
      - directus_database:/var/lib/postgresql/data

    environment:
      POSTGRES_USER: "directus"
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
      POSTGRES_DB: "directus"
    healthcheck:
      test: ["CMD", "pg_isready", "--host=localhost", "--username=directus"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s

  cache:
    image: redis:6
    healthcheck:
      test: ["CMD-SHELL", "[ $$(redis-cli ping) = 'PONG' ]"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_interval: 5s
      start_period: 30s


  directus:
    image: directus/directus:11.12.0
    ports:
      - 8055
    volumes:
      - directus_uploads:/directus/uploads
      - directus_extensions:/directus/extensions
    depends_on:
      database:
        condition: service_healthy
      cache:
        condition: service_healthy
    environment:
      SECRET: ${DIRECTUS_SECRET}

      DB_CLIENT: "pg"
      DB_HOST: "database"
      DB_PORT: "5432"
      DB_DATABASE: "directus"
      DB_USER: "directus"
      DB_PASSWORD: ${DATABASE_PASSWORD}

      CACHE_ENABLED: "true"
      CACHE_AUTO_PURGE: "true"
      CACHE_STORE: "redis"
      REDIS: "redis://cache:6379"

      # After first successful login, remove the admin email/password env. variables below
      # as these will now be stored in the database.
      ADMIN_EMAIL: "admin@example.com"
      ADMIN_PASSWORD: "d1r3ctu5"
volumes:
  directus_uploads:
  directus_extensions:
  directus_database:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
