---
title: Host Wiki.js with Rustploy
description: "One of the most complete and extensible tools for building modern wikis and documentation. Create Wiki.js in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Wiki.js**: One of the most complete and extensible tools for building modern wikis and documentation. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `wikijs` |
| **Containers** | 2 (`wiki`, `db`) |
| **Images** | `ghcr.io/requarks/wiki:2.5`, `postgres:14` |
| **UI port** | 3000, on service `wiki` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Wiki.js** and select it.
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
| `POSTGRES_USER` | wikijs |
| `POSTGRES_PASSWORD` | wikijsrocks |
| `POSTGRES_DB` | wiki |
| `DB_TYPE` | postgres |
| `DB_HOST` | db |
| `DB_PORT` | 5432 |
| `DB_USER` | wikijs |
| `DB_PASS` | wikijsrocks |
| `DB_NAME` | wiki |

## Domains

| Service | Port | Host |
|---|---|---|
| `wiki` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.5'
services:
  wiki:
    image: ghcr.io/requarks/wiki:2.5
    restart: unless-stopped
    environment:
      - DB_TYPE
      - DB_HOST
      - DB_PORT
      - DB_USER
      - DB_PASS
      - DB_NAME
    depends_on:
      - db
    labels:
      - traefik.enable=true
      - traefik.constraint-label-stack=wikijs
  db:
    image: postgres:14
    restart: unless-stopped
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - wiki-db-data:/var/lib/postgresql/data
volumes:
  wiki-db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
