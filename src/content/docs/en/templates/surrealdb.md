---
title: Host SurrealDB with Rustploy
description: "Modern multi-model database (relational, graph, document, vector), unified. Create SurrealDB in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**SurrealDB**: Modern multi-model database (relational, graph, document, vector), unified. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `surrealdb` |
| **Containers** | 1 (`surrealdb`) |
| **Images** | `surrealdb/surrealdb:v2.3.10` |
| **UI port** | 8000, on service `surrealdb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **SurrealDB** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `surrealdb_user` | *generated username* |
| `surrealdb_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SURREAL_USER` | ${surrealdb_user} |
| `SURREAL_PASS` | ${surrealdb_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `surrealdb` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  surrealdb:
    image: surrealdb/surrealdb:v2.3.10
    environment:
      SURREAL_USER: ${SURREAL_USER}
      SURREAL_PASS: ${SURREAL_PASS}
    volumes:
      - db_data:/usr/app/data
    user: root
    command: start rocksdb:/db_data/data.db
    pull_policy: always

volumes:
  db_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
