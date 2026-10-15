---
title: Host Authentik with Rustploy
description: "Integrated identity and access manager (SAML, OAuth2, OIDC). Create Authentik in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Authentik**: Integrated identity and access manager (SAML, OAuth2, OIDC). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `authentik` |
| **Containers** | 4 (`postgresql`, `redis`, `server`, `worker`) |
| **Images** | `docker.io/library/postgres:16-alpine`, `docker.io/library/redis:alpine`, `${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.6.3}` |
| **UI port** | 9000, on service `server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Authentik** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `main_domain_1` | *domain (generated; replace it with yours)* |
| `pg_user` | authentik |
| `pg_db` | authentik |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PG_USER` | ${pg_user} |
| `PG_DB` | ${pg_db} |
| `PG_PASS` | *random password, 32 characters* |
| `AUTHENTIK_SECRET_KEY` | *random password, 64 characters* |
| `AUTHENTIK_IMAGE` | ghcr.io/goauthentik/server |
| `AUTHENTIK_TAG` | 2025.6.3 |

## Domains

| Service | Port | Host |
|---|---|---|
| `server` | 9000 | ${main_domain} |
| `server` | 9443 | ${main_domain_1} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  postgresql:
    image: docker.io/library/postgres:16-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -d $${POSTGRES_DB} -U $${POSTGRES_USER}"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 5s
    volumes:
      - database:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${PG_PASS}
      POSTGRES_USER: ${PG_USER}
      POSTGRES_DB: ${PG_DB}
    expose:
      - 5432

  redis:
    image: docker.io/library/redis:alpine
    command: --save 60 1 --loglevel warning
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping | grep PONG"]
      start_period: 20s
      interval: 30s
      retries: 5
      timeout: 3s
    volumes:
      - redis:/data
    expose:
      - 6379

  server:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.6.3}
    restart: unless-stopped
    command: server
    environment:
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY}
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    volumes:
      - media:/media
      - custom-templates:/templates
    expose:
      - 9000
      - 9443
    depends_on:
      postgresql:
        condition: service_healthy
      redis:
        condition: service_healthy

  worker:
    image: ${AUTHENTIK_IMAGE:-ghcr.io/goauthentik/server}:${AUTHENTIK_TAG:-2025.6.3}
    restart: unless-stopped
    command: worker
    environment:
      AUTHENTIK_SECRET_KEY: ${AUTHENTIK_SECRET_KEY}
      AUTHENTIK_REDIS__HOST: redis
      AUTHENTIK_POSTGRESQL__HOST: postgresql
      AUTHENTIK_POSTGRESQL__USER: ${PG_USER}
      AUTHENTIK_POSTGRESQL__NAME: ${PG_DB}
      AUTHENTIK_POSTGRESQL__PASSWORD: ${PG_PASS}
    user: root
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - media:/media
      - certs:/certs
      - custom-templates:/templates
    depends_on:
      postgresql:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  database:
    driver: local
  redis:
    driver: local
  media:
    driver: local
  certs:
    driver: local
  custom-templates:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
