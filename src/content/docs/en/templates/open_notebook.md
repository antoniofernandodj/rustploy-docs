---
title: Host Open Notebook with Rustploy
description: "Notebook integrated with SurrealDB and AI-assisted utilities. Create Open Notebook in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Open Notebook**: Notebook integrated with SurrealDB and AI-assisted utilities. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `open_notebook` |
| **Containers** | 2 (`surrealdb`, `open_notebook`) |
| **Images** | `surrealdb/surrealdb:v2`, `lfnovo/open_notebook:latest` |
| **UI port** | 8000, on service `surrealdb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Open Notebook** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `surrealdb_port` | 8000 |
| `open_notebook_port` | 8502 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SURREAL_URL` | ws://surrealdb:8000/rpc |
| `SURREAL_USER` | root |
| `SURREAL_PASSWORD` | root |
| `SURREAL_NAMESPACE` | open_notebook |
| `SURREAL_DATABASE` | staging |

## Domains

| Service | Port | Host |
|---|---|---|
| `surrealdb` | 8000 | surrealdb-${main_domain} |
| `open_notebook` | 8502 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  surrealdb:
    image: surrealdb/surrealdb:v2
    ports:
      - 8000
    volumes:
      - ../files/surreal_data:/mydata
    command: start --user root --pass root rocksdb:/mydata/mydatabase.db
    pull_policy: always
    user: root

  open_notebook:
    image: lfnovo/open_notebook:latest
    ports:
      - 8502
    environment:
      - SURREAL_URL=ws://surrealdb:8000/rpc
      - SURREAL_USER=root
      - SURREAL_PASSWORD=root
      - SURREAL_NAMESPACE=open_notebook
      - SURREAL_DATABASE=staging
    depends_on:
      - surrealdb
    pull_policy: always
    volumes:
      - ../files/notebook_data:/app/data
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
