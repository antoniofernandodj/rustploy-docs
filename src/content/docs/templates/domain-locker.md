---
title: Hospedar Domain Locker com Rustploy
description: "Monitor e rastreador automático de expiração de domínios web. Crie Domain Locker em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Domain Locker**: Monitor e rastreador automático de expiração de domínios web. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `domain-locker` |
| **Containers** | 3 (`postgres`, `app`, `updater`) |
| **Imagens** | `postgres:15-alpine`, `lissy93/domain-locker:latest`, `alpine:3.20` |
| **Porta da interface** | 3000, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Domain Locker** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `pg_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NODE_ENV` | production |
| `DL_ENV_TYPE` | selfHosted |
| `DL_PG_HOST` | postgres |
| `DL_PG_PORT` | 5432 |
| `DL_PG_USER` | postgres |
| `DL_PG_PASSWORD` | ${pg_password} |
| `DL_PG_NAME` | domain_locker |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DL_PG_NAME:-domain_locker}
      POSTGRES_USER: ${DL_PG_USER:-postgres}
      POSTGRES_PASSWORD: ${DL_PG_PASSWORD:-changeme2420}
    expose:
      - "5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # - ./db/schema.sql:/docker-entrypoint-initdb.d/init-schema.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DL_PG_USER:-postgres}"]
      interval: 5s
      timeout: 3s
      retries: 10

  app:
    image: lissy93/domain-locker:latest
    restart: unless-stopped
    environment:
      NODE_ENV: "production"
      DL_ENV_TYPE: ${DL_ENV_TYPE:-selfHosted}
      DL_PG_HOST: ${DL_PG_HOST:-postgres}
      DL_PG_PORT: ${DL_PG_PORT:-5432}
      DL_PG_USER: ${DL_PG_USER:-postgres}
      DL_PG_PASSWORD: ${DL_PG_PASSWORD:-changeme2420}
      DL_PG_NAME: ${DL_PG_NAME:-domain_locker}
    expose:
      - "3000"
    depends_on:
      - postgres

  updater:
    image: alpine:3.20
    restart: unless-stopped
    depends_on:
      - app
    command: >
      /bin/sh -c "
        apk add --no-cache curl &&
        echo '0 3 * * * /usr/bin/curl -s -X POST http://app:3000/api/domain-updater' > /etc/crontabs/root &&
        echo '0 4 * * * /usr/bin/curl -s -X POST http://app:3000/api/expiration-reminders' >> /etc/crontabs/root &&
        crond -f -L /dev/stdout
      "

volumes:
  postgres_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
