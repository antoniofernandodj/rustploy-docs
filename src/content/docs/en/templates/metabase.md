---
title: Host Metabase with Rustploy
description: "Easy Business Intelligence platform for quickly building reports and dashboards. Create Metabase in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Metabase**: Easy Business Intelligence platform for quickly building reports and dashboards. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `metabase` |
| **Containers** | 2 (`metabase`, `postgres`) |
| **Images** | `metabase/metabase:v0.50.8`, `postgres:14` |
| **UI port** | 3000, on service `metabase` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Metabase** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `metabase` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  metabase:
    image: metabase/metabase:v0.50.8
    volumes:
      - /dev/urandom:/dev/random:ro
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabaseappdb
      MB_DB_PORT: 5432
      MB_DB_USER: metabase
      MB_DB_PASS: mysecretpassword
      MB_DB_HOST: postgres
    healthcheck:
      test: curl --fail -I http://localhost:3000/api/health || exit 1
      interval: 15s
      timeout: 5s
      retries: 5
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: metabase
      POSTGRES_DB: metabaseappdb
      POSTGRES_PASSWORD: mysecretpassword
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
