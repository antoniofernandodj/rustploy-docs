---
title: Hospedar Etherpad com Rustploy
description: "Editor de texto colaborativo multiusuário em tempo real. Crie Etherpad em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Etherpad**: Editor de texto colaborativo multiusuário em tempo real. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `etherpad` |
| **Containers** | 2 (`app`, `postgres`) |
| **Imagens** | `etherpad/etherpad:latest`, `postgres:15-alpine` |
| **Porta da interface** | 9001, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Etherpad** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_password` | *senha aleatória de 32 caracteres* |
| `postgres_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NODE_ENV` | production |
| `ADMIN_PASSWORD` | ${admin_password} |
| `DB_CHARSET` | utf8mb4 |
| `DB_HOST` | postgres |
| `DB_NAME` | etherpad |
| `DB_PASS` | ${postgres_password} |
| `DB_PORT` | 5432 |
| `DB_TYPE` | postgres |
| `DB_USER` | admin |
| `DEFAULT_PAD_TEXT` |   |
| `DISABLE_IP_LOGGING` | false |
| `SOFFICE` | null |
| `TRUST_PROXY` | true |
| `POSTGRES_DB` | etherpad |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_USER` | admin |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 9001 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  app:
    user: "0:0"
    image: etherpad/etherpad:latest
    tty: true
    stdin_open: true
    volumes:
      - ../files/plugins:/opt/etherpad-lite/src/plugin_packages
      - ../files/etherpad_var:/opt/etherpad-lite/var
    depends_on:
      - postgres
    environment:
      NODE_ENV: ${NODE_ENV}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      DB_CHARSET: ${DB_CHARSET}
      DB_HOST: ${DB_HOST}
      DB_NAME: ${DB_NAME}
      DB_PASS: ${DB_PASS}
      DB_PORT: ${DB_PORT}
      DB_TYPE: ${DB_TYPE}
      DB_USER: ${DB_USER}
      DEFAULT_PAD_TEXT: ${DEFAULT_PAD_TEXT}
      DISABLE_IP_LOGGING: ${DISABLE_IP_LOGGING}
      SOFFICE: ${SOFFICE}
      TRUST_PROXY: ${TRUST_PROXY}
    restart: always
    expose:
      - 9001
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      PGDATA: /var/lib/postgresql/data/pgdata
    restart: always
    volumes:
      - ../files/postgres_data:/var/lib/postgresql/data/pgdata
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
