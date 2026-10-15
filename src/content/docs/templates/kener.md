---
title: Hospedar Kener com Rustploy
description: "Página de status open-source moderna para monitoramento de infraestrutura. Crie Kener em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Kener**: Página de status open-source moderna para monitoramento de infraestrutura. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kener` |
| **Containers** | 3 (`kener`, `postgres`, `mysql`) |
| **Imagens** | `rajnandan1/kener:latest`, `postgres:alpine`, `mariadb:11` |
| **Porta da interface** | 3000, no serviço `kener` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Kener** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `KENER_SECRET_KEY` | *senha aleatória de 64 caracteres* |
| `POSTGRES_PASSWORD` | *senha aleatória de 32 caracteres* |
| `MYSQL_PASSWORD` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TZ` | Etc/UTC |
| `KENER_SECRET_KEY` | ${KENER_SECRET_KEY} |
| `DATABASE_URL` | sqlite://./database/kener.sqlite.db |
| `KENER_BASE_PATH` |  |
| `ORIGIN` | http://localhost:3000 |
| `RESEND_API_KEY` |  |
| `RESEND_SENDER_EMAIL` | Accounts <accounts@resend.dev> |
| `POSTGRES_USER` | user |
| `POSTGRES_DB` | kener_db |
| `MYSQL_USER` | user |
| `MYSQL_DATABASE` | kener_db |
| `MYSQL_RANDOM_ROOT_PASSWORD` | true |
| `MYSQL_PASSWORD` | ${MYSQL_PASSWORD} |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `kener` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  kener:
    image: rajnandan1/kener:latest
    environment:
      - TZ=${TZ}
      - KENER_SECRET_KEY=${KENER_SECRET_KEY} # 🔐 API key / secret
      - DATABASE_URL=${DATABASE_URL}
      - KENER_BASE_PATH=${KENER_BASE_PATH}
      - ORIGIN=${ORIGIN}
      - RESEND_API_KEY=${RESEND_API_KEY} # 🔐 API key
      - RESEND_SENDER_EMAIL=${RESEND_SENDER_EMAIL}
    ports:
      - 3000
    volumes:
      - kener_db:/app/database
      - ../files/uploads:/app/uploads
    restart: unless-stopped

  postgres:
    image: postgres:alpine
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD} # 🔐 DB password
      - POSTGRES_DB=${POSTGRES_DB}
    restart: unless-stopped

  mysql:
    image: mariadb:11
    environment:
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD} # 🔐 DB password
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_RANDOM_ROOT_PASSWORD=true
    restart: unless-stopped

volumes:
  kener_db: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
