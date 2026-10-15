---
title: Host CodeX Docs with Rustploy
description: "Engineering hub with unified tools such as Editor.js and Hawk.so. Create CodeX Docs in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**CodeX Docs**: Engineering hub with unified tools such as Editor.js and Hawk.so. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `codex-docs` |
| **Containers** | 2 (`codex`, `mongo`) |
| **Images** | `ghcr.io/codex-team/codex.docs:v2.2`, `mongo:4` |
| **UI port** | 3000, on service `codex` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **CodeX Docs** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `MONGO_PASSWORD` | *random password, 16 characters* |
| `AUTH_PASSWORD` | *random password, 16 characters* |
| `AUTH_SECRET` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MONGO_PASSWORD` | ${MONGO_PASSWORD} |
| `AUTH_PASSWORD` | ${AUTH_PASSWORD} |
| `AUTH_SECRET` | ${AUTH_SECRET} |
| `MONGO_USERNAME` | mongo |

## Domains

| Service | Port | Host |
|---|---|---|
| `codex` | 3000 | *domain (generated; replace it with yours)* |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/docs-config.yaml`

## The template docker-compose.yml

```yaml
version: "3"

services:
  codex:
    image: ghcr.io/codex-team/codex.docs:v2.2
    ports:
      - "3000"
    environment:
      - APP_CONFIG_database_driver=mongodb
      - APP_CONFIG_database_mongodb_uri=mongodb://mongo:${MONGO_PASSWORD}@mongo:27017
      - APP_CONFIG_auth_password=${AUTH_PASSWORD}
      - APP_CONFIG_auth_secret=${AUTH_SECRET}
    volumes:
      - uploads:/usr/src/app/uploads
      - db:/usr/src/app/db
      - ../files/docs-config.yaml:/usr/src/app/docs-config.yaml
    depends_on:
      - mongo

  mongo:
    image: mongo:4
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
    volumes:
      - mongo-data:/data/db

volumes:
  uploads:
  db:
  mongo-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
