---
title: Hospedar Letterfeed com Rustploy
description: "Conversor inteligente que transforma newsletters recebidas por e-mail em feeds RSS. Crie Letterfeed em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Letterfeed**: Conversor inteligente que transforma newsletters recebidas por e-mail em feeds RSS. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `letterfeed` |
| **Containers** | 2 (`backend`, `frontend`) |
| **Imagens** | `ghcr.io/leonmuscoden/letterfeed-backend:latest`, `ghcr.io/leonmuscoden/letterfeed-frontend:latest` |
| **Porta da interface** | 3000, no serviço `frontend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Letterfeed** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória de 64 caracteres* |
| `auth_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LETTERFEED_APP_BASE_URL` | https://${main_domain} |
| `LETTERFEED_BACKEND_URL` | http://backend:8000 |
| `LETTERFEED_DATABASE_URL` | sqlite:////data/letterfeed.db |
| `LETTERFEED_IMAP_SERVER` |  |
| `LETTERFEED_IMAP_USERNAME` |  |
| `LETTERFEED_IMAP_PASSWORD` |  |
| `LETTERFEED_SEARCH_FOLDER` | INBOX |
| `LETTERFEED_MOVE_TO_FOLDER` |  |
| `LETTERFEED_MARK_AS_READ` | true |
| `LETTERFEED_EMAIL_CHECK_INTERVAL` | 15 |
| `LETTERFEED_AUTO_ADD_NEW_SENDERS` | false |
| `LETTERFEED_SECRET_KEY` | ${secret_key} |
| `LETTERFEED_AUTH_USERNAME` | admin |
| `LETTERFEED_AUTH_PASSWORD` | ${auth_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `frontend` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.9"

services:
  backend:
    image: ghcr.io/leonmuscoden/letterfeed-backend:latest
    restart: unless-stopped
    environment:
      LETTERFEED_APP_BASE_URL: ${LETTERFEED_APP_BASE_URL}
      LETTERFEED_BACKEND_URL: ${LETTERFEED_BACKEND_URL}
      LETTERFEED_DATABASE_URL: ${LETTERFEED_DATABASE_URL}
      LETTERFEED_IMAP_SERVER: ${LETTERFEED_IMAP_SERVER}
      LETTERFEED_IMAP_USERNAME: ${LETTERFEED_IMAP_USERNAME}
      LETTERFEED_IMAP_PASSWORD: ${LETTERFEED_IMAP_PASSWORD}
      LETTERFEED_SEARCH_FOLDER: ${LETTERFEED_SEARCH_FOLDER}
      LETTERFEED_MOVE_TO_FOLDER: ${LETTERFEED_MOVE_TO_FOLDER}
      LETTERFEED_MARK_AS_READ: ${LETTERFEED_MARK_AS_READ}
      LETTERFEED_EMAIL_CHECK_INTERVAL: ${LETTERFEED_EMAIL_CHECK_INTERVAL}
      LETTERFEED_AUTO_ADD_NEW_SENDERS: ${LETTERFEED_AUTO_ADD_NEW_SENDERS}
      LETTERFEED_SECRET_KEY: ${LETTERFEED_SECRET_KEY}
      LETTERFEED_AUTH_USERNAME: ${LETTERFEED_AUTH_USERNAME}
      LETTERFEED_AUTH_PASSWORD: ${LETTERFEED_AUTH_PASSWORD}
    volumes:
      - letterfeed_data:/data

  frontend:
    image: ghcr.io/leonmuscoden/letterfeed-frontend:latest
    restart: unless-stopped
    environment:
      LETTERFEED_APP_BASE_URL: ${LETTERFEED_APP_BASE_URL}
      LETTERFEED_BACKEND_URL: ${LETTERFEED_BACKEND_URL}
    expose:
      - 3000
    depends_on:
      - backend

volumes:
  letterfeed_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
