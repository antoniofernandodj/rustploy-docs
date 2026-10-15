---
title: Hospedar Authelia com Rustploy
description: "Provedor de Single Sign-On (SSO) com autenticação multifator (2FA). Crie Authelia em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Authelia**: Provedor de Single Sign-On (SSO) com autenticação multifator (2FA). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `authelia` |
| **Containers** | 3 (`authelia`, `redis`, `postgres`) |
| **Imagens** | `authelia/authelia:latest`, `redis:7-alpine`, `postgres:16-alpine` |
| **Porta da interface** | 9091, no serviço `authelia` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Authelia** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `jwt_secret` | *senha aleatória de 64 caracteres* |
| `session_secret` | *senha aleatória de 64 caracteres* |
| `storage_encryption_key` | *senha aleatória de 64 caracteres* |
| `redis_password` | *senha aleatória de 32 caracteres* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `admin_username` | *usuário gerado* |
| `admin_email` | *e-mail gerado* |
| `admin_password` | AdminPass123! |
| `admin_password_hash` | $argon2id$v=19$m=65536,t=3,p=4$170PGJ1MskQyxfFknfBPFQ$VqD1/pqC3fBHo+Zk58bC2xQm1ltOFTr0w2wx93vJgC4 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_SECRET` | *JWT gerado* |
| `SESSION_SECRET` | ${session_secret} |
| `STORAGE_ENCRYPTION_KEY` | ${storage_encryption_key} |
| `REDIS_PASSWORD` | ${redis_password} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `admin_username` | ${admin_username} |
| `admin_email` | ${admin_email} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `authelia` | 9091 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `configuration.yml`
- `users_database.yml`

## docker-compose.yml do template

```yaml
services:
  authelia:
    image: authelia/authelia:latest
    restart: unless-stopped
    volumes:
      - authelia_config:/config
      - ../files/configuration.yml:/config/configuration.yml:ro
      - ../files/users_database.yml:/config/users_database.yml
    environment:
      AUTHELIA_JWT_SECRET: $JWT_SECRET
      AUTHELIA_SESSION_SECRET: $SESSION_SECRET
      AUTHELIA_STORAGE_ENCRYPTION_KEY: $STORAGE_ENCRYPTION_KEY
      AUTHELIA_STORAGE_POSTGRES_PASSWORD: $POSTGRES_PASSWORD
    depends_on:
      redis:
        condition: service_healthy
      postgres:
        condition: service_healthy
    ports:
      - 9091

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    command: redis-server --save 60 1 --loglevel warning --requirepass $REDIS_PASSWORD
    environment:
      REDIS_PASSWORD: $REDIS_PASSWORD
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: authelia
      POSTGRES_USER: authelia
      POSTGRES_PASSWORD: $POSTGRES_PASSWORD
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U authelia -d authelia"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  authelia_config:
  redis_data:
  postgres_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
