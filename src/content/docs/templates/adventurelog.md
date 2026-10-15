---
title: Hospedar AdventureLog com Rustploy
description: "Rastreador de atividades físicas com integração ao Strava. Crie AdventureLog em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AdventureLog**: Rastreador de atividades físicas com integração ao Strava. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `adventurelog` |
| **Containers** | 3 (`web`, `db`, `server`) |
| **Imagens** | `ghcr.io/seanmorley15/adventurelog-frontend:latest`, `postgis/postgis:16-3.5`, `ghcr.io/seanmorley15/adventurelog-backend:latest` |
| **Porta da interface** | 3000, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AdventureLog** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `frontend_domain` | *domínio (gerado; troque pelo seu)* |
| `backend_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 16 caracteres* |
| `secret_key` | *senha aleatória de 32 caracteres* |
| `admin_username` | admin |
| `admin_password` | *senha aleatória de 12 caracteres* |
| `admin_email` | *e-mail gerado* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PGHOST` | db |
| `POSTGRES_DB` | adventure |
| `POSTGRES_USER` | adventure |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `SECRET_KEY` | ${secret_key} |
| `DJANGO_ADMIN_USERNAME` | ${admin_username} |
| `DJANGO_ADMIN_PASSWORD` | ${admin_password} |
| `DJANGO_ADMIN_EMAIL` | ${admin_email} |
| `DEBUG` | False |
| `CSRF_TRUSTED_ORIGINS` | http://${backend_domain},http://${frontend_domain} |
| `FRONTEND_URL` | http://${frontend_domain} |
| `PUBLIC_URL` | http://${backend_domain} |
| `PUBLIC_SERVER_URL` | ${backend_domain} |
| `ORIGIN` | http://${frontend_domain} |
| `BODY_SIZE_LIMIT` | Infinity |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 3000 | ${frontend_domain} |
| `server` | 80 | ${backend_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  web:
    image: ghcr.io/seanmorley15/adventurelog-frontend:latest
    restart: unless-stopped
    depends_on:
      - server
    environment:
      # Frontend needs to know where the backend is
      PUBLIC_SERVER_URL: ${PUBLIC_SERVER_URL}
      ORIGIN: ${ORIGIN}
      BODY_SIZE_LIMIT: ${BODY_SIZE_LIMIT}

  db:
    image: postgis/postgis:16-3.5
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  server:
    image: ghcr.io/seanmorley15/adventurelog-backend:latest
    restart: unless-stopped
    depends_on:
      - db
    volumes:
      - adventurelog_media:/code/media/
    environment:
      # DB settings for Django
      PGHOST: ${PGHOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

      # Django app settings
      SECRET_KEY: ${SECRET_KEY}
      DJANGO_ADMIN_USERNAME: ${DJANGO_ADMIN_USERNAME}
      DJANGO_ADMIN_PASSWORD: ${DJANGO_ADMIN_PASSWORD}
      DJANGO_ADMIN_EMAIL: ${DJANGO_ADMIN_EMAIL}
      DEBUG: ${DEBUG}
      CSRF_TRUSTED_ORIGINS: ${CSRF_TRUSTED_ORIGINS}
      FRONTEND_URL: ${FRONTEND_URL}
      PUBLIC_URL: ${PUBLIC_URL}

volumes:
  postgres_data: {}
  adventurelog_media: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
