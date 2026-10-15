---
title: Hospedar PocketBase com Rustploy
description: "Backend em um único arquivo embarcado com SQLite, autenticação, realtime e painel. Crie PocketBase em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**PocketBase**: Backend em um único arquivo embarcado com SQLite, autenticação, realtime e painel. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `pocketbase` |
| **Containers** | 1 (`pocketbase`) |
| **Imagens** | `adrianmusante/pocketbase:latest` |
| **Porta da interface** | 8090, no serviço `pocketbase` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **PocketBase** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `admin_email` | *e-mail gerado* |
| `admin_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `pocketbase` | 8090 | ${main_domain} |

## docker-compose.yml do template

```yaml
# IMPORTANT: Please update the admin credentials in your .env file
# Access PocketBase Admin UI at: https://your-domain.com/_/ (replace with your configured domain)
# Note: Admin UI may take up to 1 minute to load on first startup

version: "3.8"

services:
  pocketbase:
    image: adrianmusante/pocketbase:latest
    restart: always
    expose:
      - 8090
    volumes:
      - pocketbase-data:/pocketbase
    environment:
      - POCKETBASE_ADMIN_EMAIL=${ADMIN_EMAIL}
      - POCKETBASE_ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - POCKETBASE_ADMIN_UPSERT=true
      - POCKETBASE_PORT_NUMBER=8090
      # Optional: Encryption key for securing app settings (OAuth2 secrets, SMTP passwords, etc.)
      # Uncomment and set a secure key in your .env file for production use
      # - POCKETBASE_ENCRYPTION_KEY=${ENCRYPTION_KEY}
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8090/_/"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  pocketbase-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
