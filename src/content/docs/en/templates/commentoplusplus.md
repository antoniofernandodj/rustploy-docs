---
title: Host Commentoplusplus with Rustploy
description: "Commentoplusplus application. Create Commentoplusplus in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Commentoplusplus**: Commentoplusplus application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `commentoplusplus` |
| **Containers** | 2 (`commentoplusplus`, `postgres`) |
| **Images** | `caroga/commentoplusplus:v1.8.7`, `postgres:11` |
| **UI port** | 8080, on service `commentoplusplus` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Commentoplusplus** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `DOMAIN` | *domain (generated; replace it with yours)* |
| `POSTGRES_PASSWORD` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `COMMENTO_ORIGIN` | http://${DOMAIN} |
| `COMMENTO_POSTGRES` | postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/postgres?sslmode=disable |
| `COMMENTO_ENABLE_WILDCARDS` | true |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |
| `POSTGRES_DB` | postgres |
| `POSTGRES_USER` | postgres |

## Domains

| Service | Port | Host |
|---|---|---|
| `commentoplusplus` | 8080 | ${DOMAIN} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  commentoplusplus:
    image: caroga/commentoplusplus:v1.8.7
    ports:
      - "8080"
    environment:
      - COMMENTO_ORIGIN=${COMMENTO_ORIGIN}
      - COMMENTO_POSTGRES=${COMMENTO_POSTGRES}
      - COMMENTO_ENABLE_WILDCARDS=true
    depends_on:
      - postgres

  postgres:
    image: postgres:11
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
