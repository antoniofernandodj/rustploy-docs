---
title: Host CouchDB with Rustploy
description: "Document-based NoSQL database with excellent synchronization. Create CouchDB in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**CouchDB**: Document-based NoSQL database with excellent synchronization. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `couchdb` |
| **Containers** | 1 (`couchdb`) |
| **Images** | `couchdb:latest` |
| **UI port** | 5984, on service `couchdb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **CouchDB** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `username` | *random password, 16 characters* |
| `password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `COUCHDB_USER` | *generated username* |
| `COUCHDB_PASSWORD` | *random password* |

## Domains

| Service | Port | Host |
|---|---|---|
| `couchdb` | 5984 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  couchdb:
    image: couchdb:latest
    ports:
      - '5984'
    volumes:
      - couchdb-data:/opt/couchdb/data
    environment:
      - COUCHDB_USER=${COUCHDB_USER}
      - COUCHDB_PASSWORD=${COUCHDB_PASSWORD}
    restart: unless-stopped

volumes:
  couchdb-data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
