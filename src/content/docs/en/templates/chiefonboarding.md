---
title: Host Chief-Onboarding with Rustploy
description: "System for managing and onboarding new employees. Create Chief-Onboarding in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Chief-Onboarding**: System for managing and onboarding new employees. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `chiefonboarding` |
| **Containers** | 2 (`chiefonboarding`, `db`) |
| **Images** | `chiefonboarding/chiefonboarding:v2.2.5`, `postgres:13` |
| **UI port** | 8000, on service `chiefonboarding` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Chief-Onboarding** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |
| `secret_key` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `SECRET_KEY` | ${secret_key} |
| `DOMAIN` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `chiefonboarding` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  chiefonboarding:
    image: chiefonboarding/chiefonboarding:v2.2.5
    restart: unless-stopped
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DATABASE_URL=postgres://postgres:${DB_PASSWORD}@db:5432/chiefonboarding
      - ALLOWED_HOSTS=${DOMAIN}
    ports:
      - 8000
    depends_on:
      - db

  db:
    image: postgres:13
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=chiefonboarding
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
