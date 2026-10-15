---
title: Host Evershop with Rustploy
description: "Complete, modular e-commerce and online store solution. Create Evershop in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Evershop**: Complete, modular e-commerce and online store solution. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `evershop` |
| **Containers** | 2 (`evershop-app`, `database`) |
| **Images** | `evershop/evershop:latest`, `postgres:16` |
| **UI port** | 3000, on service `evershop-app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Evershop** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_user` | postgres |
| `db_password` | postgres |
| `db_name` | evershop |
| `db_port` | 5432 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_NAME` | ${db_name} |
| `DB_PORT` | ${db_port} |

## Domains

| Service | Port | Host |
|---|---|---|
| `evershop-app` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  evershop-app:
    image: evershop/evershop:latest
    restart: always
    environment:
      DB_HOST: database
      DB_PORT: ${DB_PORT}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_USER: ${DB_USER}
      DB_NAME: ${DB_NAME}
    depends_on:
      - database
    ports:
      - 3000
  
  database:
    image: postgres:16
    restart: unless-stopped
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - ${DB_PORT}

volumes:
  postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
