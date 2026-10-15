---
title: Hospedar Infisical com Rustploy
description: "Plataforma unificada de gerenciamento de secrets, chaves e variáveis de ambiente. Crie Infisical em um clique no Rustploy: 4 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Infisical**: Plataforma unificada de gerenciamento de secrets, chaves e variáveis de ambiente. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `infisical` |
| **Containers** | 4 (`db-migration`, `backend`, `redis`, `db`) |
| **Imagens** | `infisical/infisical:v0.135.0-postgres`, `redis:7.4.1`, `postgres:14-alpine` |
| **Porta da interface** | 8080, no serviço `backend` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Infisical** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `postgres_user` | infisical |
| `postgres_db` | infisical |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ENCRYPTION_KEY` | 6c1fe4e407b8911c104518103505b218 |
| `AUTH_SECRET` | 5lrMXKKWCVocS/uerPsl7V+TX/aaUaI7iDkgl3tSmLE= |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_DB` | ${postgres_db} |
| `SITE_URL` | http://${main_domain}:8080 |
| `SMTP_HOST` |  |
| `SMTP_PORT` |  |
| `SMTP_NAME` |  |
| `SMTP_USERNAME` |  |
| `SMTP_PASSWORD` |  |
| `CLIENT_ID_HEROKU` |  |
| `CLIENT_ID_VERCEL` |  |
| `CLIENT_ID_NETLIFY` |  |
| `CLIENT_ID_GITHUB` |  |
| `CLIENT_ID_GITHUB_APP` |  |
| `CLIENT_SLUG_GITHUB_APP` |  |
| `CLIENT_ID_GITLAB` |  |
| `CLIENT_ID_BITBUCKET` |  |
| `CLIENT_SECRET_HEROKU` |  |
| `CLIENT_SECRET_VERCEL` |  |
| `CLIENT_SECRET_NETLIFY` |  |
| `CLIENT_SECRET_GITHUB` |  |
| `CLIENT_SECRET_GITHUB_APP` |  |
| `CLIENT_SECRET_GITLAB` |  |
| `CLIENT_SECRET_BITBUCKET` |  |
| `CLIENT_SLUG_VERCEL` |  |
| `CLIENT_PRIVATE_KEY_GITHUB_APP` |  |
| `CLIENT_APP_ID_GITHUB_APP` |  |
| `SENTRY_DSN` |  |
| `POSTHOG_HOST` |  |
| `POSTHOG_PROJECT_API_KEY` |  |
| `CLIENT_ID_GOOGLE_LOGIN` |  |
| `CLIENT_SECRET_GOOGLE_LOGIN` |  |
| `CLIENT_ID_GITHUB_LOGIN` |  |
| `CLIENT_SECRET_GITHUB_LOGIN` |  |
| `CLIENT_ID_GITLAB_LOGIN` |  |
| `CLIENT_SECRET_GITLAB_LOGIN` |  |
| `CAPTCHA_SECRET` |  |
| `NEXT_PUBLIC_CAPTCHA_SITE_KEY` |  |
| `PLAIN_API_KEY` |  |
| `PLAIN_WISH_LABEL_IDS` |  |
| `SSL_CLIENT_CERTIFICATE_HEADER_KEY` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `backend` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  db-migration:
    depends_on:
      db:
        condition: service_healthy
    image: infisical/infisical:v0.135.0-postgres
    environment:
      - NODE_ENV=production
      - ENCRYPTION_KEY
      - AUTH_SECRET
      - SITE_URL
      - DB_CONNECTION_URI=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST
      - SMTP_PORT
      - SMTP_FROM_NAME
      - SMTP_USERNAME
      - SMTP_PASSWORD
      - SMTP_SECURE=true
    command: npm run migration:latest
    pull_policy: always

  backend:
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
      db-migration:
        condition: service_completed_successfully
    image: infisical/infisical:v0.135.0-postgres
    pull_policy: always
    environment:
      - NODE_ENV=production
      - ENCRYPTION_KEY
      - AUTH_SECRET
      - SITE_URL
      - DB_CONNECTION_URI=postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379
      - SMTP_HOST
      - SMTP_PORT
      - SMTP_FROM_NAME
      - SMTP_USERNAME
      - SMTP_PASSWORD
      - SMTP_SECURE=true


  redis:
    image: redis:7.4.1
    env_file: .env
    restart: always
    environment:
      - ALLOW_EMPTY_PASSWORD=yes

    volumes:
      - redis_infisical_data:/data

  db:
    image: postgres:14-alpine
    restart: always
    environment:
      - POSTGRES_PASSWORD
      - POSTGRES_USER
      - POSTGRES_DB
    volumes:
      - pg_infisical_data:/var/lib/postgresql/data

    healthcheck:
      test: "pg_isready --username=${POSTGRES_USER} && psql --username=${POSTGRES_USER} --list"
      interval: 5s
      timeout: 10s
      retries: 10

volumes:
  pg_infisical_data:
  redis_infisical_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
