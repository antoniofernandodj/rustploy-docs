---
title: Hospedar Unleash com Rustploy
description: "Plataforma corporativa robusta voltada ao gerenciamento de Feature Flags e estratégias de rollout. Crie Unleash em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Unleash**: Plataforma corporativa robusta voltada ao gerenciamento de Feature Flags e estratégias de rollout. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `unleash` |
| **Containers** | 2 (`unleash`, `db`) |
| **Imagens** | `unleashorg/unleash-server:7.4.0`, `postgres:15` |
| **Porta da interface** | 4242, no serviço `unleash` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Unleash** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_name` | unleash |
| `db_user` | unleash |
| `db_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `unleash` | 4242 | ${main_domain} |

## docker-compose.yml do template

```yaml
# The default users credentials are:
# Login: admin
# Password: unleash4all
# It is highly recommended to change the password after first login.
# More info: https://github.com/Unleash/unleash?tab=readme-ov-file#unleash-open-source
version: "3.8"

services:
  unleash:
    image: unleashorg/unleash-server:7.4.0
    restart: unless-stopped
    environment:
      DATABASE_URL: "postgres://${DB_USER}:${DB_PASSWORD}@db/${DB_NAME}"
      DATABASE_SSL: "false"
      LOG_LEVEL: "warn"
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: wget --no-verbose --tries=1 --spider http://localhost:4242/health || exit 1
      interval: 1s
      timeout: 1m
      retries: 5
      start_period: 15s
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_DB: "${DB_NAME}"
      POSTGRES_USER: "${DB_USER}"
      POSTGRES_PASSWORD: "${DB_PASSWORD}"
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test:
        [
          "CMD",
          "pg_isready",
          "--username=${DB_USER}",
          "--host=127.0.0.1",
          "--port=5432",
        ]
      interval: 2s
      timeout: 1m
      retries: 5
      start_period: 10s

volumes:
  db_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
