---
title: Host Obsidian LiveSync with Rustploy
description: "Preconfigured CouchDB server for real-time sync of Obsidian notes. Create Obsidian LiveSync in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Obsidian LiveSync**: Preconfigured CouchDB server for real-time sync of Obsidian notes. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `obsidian-livesync` |
| **Containers** | 1 (`couchdb`) |
| **Images** | `couchdb:latest` |
| **UI port** | 5984, on service `couchdb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Obsidian LiveSync** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `COUCHDB_USER` | *generated username* |
| `COUCHDB_PASSWORD` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `COUCHDB_USER` | ${COUCHDB_USER} |
| `COUCHDB_PASSWORD` | ${COUCHDB_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `couchdb` | 5984 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `local.ini`

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  couchdb:
    image: couchdb:latest
    user: "0:0"
    environment:
      - COUCHDB_USER=${COUCHDB_USER}
      - COUCHDB_PASSWORD=${COUCHDB_PASSWORD}
    volumes:
      - couchdb-data:/opt/couchdb/data
      - ../files/local.ini:/opt/couchdb/etc/local.ini
    ports:
      - 5984

volumes:
  couchdb-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
