---
title: Host Docuseal with Rustploy
description: "Document management system focused on electronic signatures. Create Docuseal in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Docuseal**: Document management system focused on electronic signatures. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `docuseal` |
| **Containers** | 3 (`app`, `docu-postgres`, `docu-redis`) |
| **Images** | `docuseal/docuseal:latest`, `postgres:latest`, `redis:alpine` |
| **UI port** | 3000, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Docuseal** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_USER` | postgres |
| `POSTGRES_PASSWORD` | postgres |
| `POSTGRES_DB` | docuseal |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  app:
    image: docuseal/docuseal:latest
    volumes:
      - docuseal:/data/docuseal
    depends_on:
      docu-postgres:
        condition: service_healthy
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER:-docuseal}:${POSTGRES_PASSWORD}@docu-postgres:5432/${POSTGRES_DB:-docuseal}
      
  docu-postgres:
    image: postgres:latest
    volumes:
      - docuseal-db:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-docuseal} -d ${POSTGRES_DB:-docuseal}"]
      interval: 10s
      timeout: 5s
      retries: 5
      
  docu-redis:
    image: redis:alpine
    restart: always
    volumes:
      - docuseal-redis-data:/data
      
    
volumes:
  docuseal:
  docuseal-db:
  docuseal-redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
