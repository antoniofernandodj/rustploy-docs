---
title: Host Dragonfly Db with Rustploy
description: "Dragonfly Db application. Create Dragonfly Db in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Dragonfly Db**: Dragonfly Db application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dragonfly-db` |
| **Containers** | 1 (`dragonflydb`) |
| **Images** | `docker.dragonflydb.io/dragonflydb/dragonfly` |
| **UI port** | 6379, on service `dragonflydb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Dragonfly Db** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `any_helper` | *random UUID* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DFLY_requirepass` | ${db_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `dragonflydb` | 6379 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/content/configuration.conf`

## The template docker-compose.yml

```yaml
version: '3.8'
services:
  dragonflydb:
    image: 'docker.dragonflydb.io/dragonflydb/dragonfly'
    ulimits:
      memlock: -1
    ports:
      - "6379:6379"
    volumes:
      - dragonflydata:/data
    environment: 
      - DFLY_requirepass
volumes:
  dragonflydata:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
