---
title: Host Authelia with Rustploy
description: "Single Sign-On (SSO) provider with multi-factor authentication (2FA). Create Authelia in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Authelia**: Single Sign-On (SSO) provider with multi-factor authentication (2FA). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `authelia` |
| **Containers** | 3 (`authelia`, `redis`, `postgres`) |
| **Images** | `authelia/authelia:latest`, `redis:7-alpine`, `postgres:16-alpine` |
| **UI port** | 9091, on service `authelia` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Authelia** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 64 characters* |
| `session_secret` | *random password, 64 characters* |
| `storage_encryption_key` | *random password, 64 characters* |
| `redis_password` | *random password, 32 characters* |
| `postgres_password` | *random password, 32 characters* |
| `admin_username` | *generated username* |
| `admin_email` | *generated email* |
| `admin_password` | AdminPass123! |
| `admin_password_hash` | $argon2id$v=19$m=65536,t=3,p=4$170PGJ1MskQyxfFknfBPFQ$VqD1/pqC3fBHo+Zk58bC2xQm1ltOFTr0w2wx93vJgC4 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | *generated JWT* |
| `SESSION_SECRET` | ${session_secret} |
| `STORAGE_ENCRYPTION_KEY` | ${storage_encryption_key} |
| `REDIS_PASSWORD` | ${redis_password} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `admin_username` | ${admin_username} |
| `admin_email` | ${admin_email} |

## Domains

| Service | Port | Host |
|---|---|---|
| `authelia` | 9091 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `configuration.yml`
- `users_database.yml`

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
