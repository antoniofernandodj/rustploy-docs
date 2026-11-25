---
title: Host Commento++ with Rustploy
description: "Lightweight comment box for static sites with spam moderation. Create Commento++ in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Commento++**: Lightweight comment box for static sites with spam moderation. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `commento` |
| **Containers** | 2 (`commento`, `postgres`) |
| **Images** | `registry.gitlab.com/commento/commento:v1.8.0`, `postgres:11` |
| **UI port** | 8080, on service `commento` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Commento++** and select it.
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
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `commento` | 8080 | ${DOMAIN} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  commento:
    image: registry.gitlab.com/commento/commento:v1.8.0
    ports:
      - "8080"
    environment:
      - COMMENTO_ORIGIN=${COMMENTO_ORIGIN}
      - COMMENTO_POSTGRES=${COMMENTO_POSTGRES}
    depends_on:
      - postgres

  postgres:
    image: postgres:11
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
