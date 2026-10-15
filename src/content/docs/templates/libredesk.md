---
title: Hospedar Libredesk com Rustploy
description: "Central de helpdesk e suporte ao cliente empacotada em binário único. Crie Libredesk em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Libredesk**: Central de helpdesk e suporte ao cliente empacotada em binário único. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `libredesk` |
| **Containers** | 3 (`libredesk`, `db`, `redis`) |
| **Imagens** | `libredesk/libredesk:latest`, `postgres:17-alpine`, `redis:7-alpine` |
| **Porta da interface** | 9000, no serviço `libredesk` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Libredesk** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `libredesk_domain` | *domínio (gerado; troque pelo seu)* |
| `libredesk_system_user_password` | *chave base64 aleatória (32 bytes)* |
| `pg_username` | *usuário gerado* |
| `pg_password` | *senha aleatória de 16 caracteres* |
| `pg_database` | libredesk |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LIBREDESK_SYSTEM_USER_PASSWORD` | ${libredesk_system_user_password} |
| `POSTGRES_USER` | ${pg_username} |
| `POSTGRES_PASSWORD` | ${pg_password} |
| `POSTGRES_DB` | ${pg_database} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `libredesk` | 9000 | ${libredesk_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `config.toml`

## docker-compose.yml do template

```yaml
services:
  libredesk:
    image: libredesk/libredesk:latest
    restart: unless-stopped
    ports:
      - 9000
    environment:
      # If the password is set during first docker-compose up, the system user password will be set to this value.
      # You can always set system user password later by running `docker exec -it libredesk_app ./libredesk --set-system-user-password`.
      LIBREDESK_SYSTEM_USER_PASSWORD: ${LIBREDESK_SYSTEM_USER_PASSWORD:-}
    depends_on:
      - db
      - redis
    volumes:
      - ../files/uploads:/libredesk/uploads:rw
      - ../files/config.toml:/libredesk/config.toml
    command: [ sh, -c, "./libredesk --install --idempotent-install --yes --config /libredesk/config.toml && ./libredesk --upgrade --yes --config /libredesk/config.toml && ./libredesk --config /libredesk/config.toml" ]

  # PostgreSQL database
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    ports:
      # Only bind on the local interface. To connect to Postgres externally, change this to 0.0.0.0
      - 5432
    environment:
      # Set these environment variables to configure the database, defaults to libredesk.
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-libredesk} -d ${POSTGRES_DB:-libredesk}" ]
      interval: 10s
      timeout: 5s
      retries: 6
    volumes:
      - postgres-data:/var/lib/postgresql/data

  # Redis
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      # Only bind on the local interface.
      - 6379
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
