---
title: Hospedar Hi.events com Rustploy
description: "Plataforma integrada de venda de ingressos e gestão de eventos locais. Crie Hi.events em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Hi.events**: Plataforma integrada de venda de ingressos e gestão de eventos locais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `hi-events` |
| **Containers** | 2 (`all-in-one`, `postgres`) |
| **Imagens** | `daveearley/hi.events-all-in-one:v0.8.0-beta.1`, `elestio/postgres:16` |
| **Porta da interface** | 80, no serviço `all-in-one` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Hi.events** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `jwt_secret` | *senha aleatória* |
| `app_key` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DOMAIN` | ${main_domain} |
| `POSTGRES_DB` | hievents |
| `POSTGRES_USER` | hievents |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `VITE_STRIPE_PUBLISHABLE_KEY` |  |
| `APP_KEY` | ${app_key} |
| `JWT_SECRET` | *JWT gerado* |
| `MAIL_MAILER` |  |
| `MAIL_HOST` |  |
| `MAIL_PORT` |  |
| `MAIL_FROM_ADDRESS` |  |
| `MAIL_FROM_NAME` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `all-in-one` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  all-in-one:
    image: daveearley/hi.events-all-in-one:v0.8.0-beta.1
    restart: always
    environment:
      - VITE_FRONTEND_URL=https://${DOMAIN}
      - APP_FRONTEND_URL=https://${DOMAIN}
      - VITE_API_URL_CLIENT=https://${DOMAIN}/api
      - VITE_API_URL_SERVER=http://localhost:80/api
      - VITE_STRIPE_PUBLISHABLE_KEY
      - LOG_CHANNEL=stderr
      - QUEUE_CONNECTION=sync
      - MAIL_MAILER=array
      - APP_KEY
      - JWT_SECRET
      - FILESYSTEM_PUBLIC_DISK=public
      - FILESYSTEM_PRIVATE_DISK=local
      - APP_CDN_URL=https://${DOMAIN}/storage
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - MAIL_MAILER
      - MAIL_HOST
      - MAIL_PORT
      - MAIL_FROM_ADDRESS
      - MAIL_FROM_NAME
    depends_on:
      - postgres

  postgres:
    image: elestio/postgres:16
    restart: always

    environment:
      - POSTGRES_DB
      - POSTGRES_USER
      - POSTGRES_PASSWORD
    volumes:
      - pg_hi-events_data:/var/lib/postgresql/data

volumes:
  pg_hi-events_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
