---
title: Host Cockpit with Rustploy
description: "Headless CMS with an API-driven architecture for content delivery. Create Cockpit in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cockpit**: Headless CMS with an API-driven architecture for content delivery. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cockpit` |
| **Containers** | 2 (`cockpit`, `mongo`) |
| **Images** | `cockpithq/cockpit:core-2.11.0`, `mongo:4` |
| **UI port** | 80, on service `cockpit` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cockpit** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `SALT` | *random password, 32 characters* |
| `MONGO_PASSWORD` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SALT` | ${SALT} |
| `MONGO_PASSWORD` | ${MONGO_PASSWORD} |
| `MONGO_USERNAME` | mongo |

## Domains

| Service | Port | Host |
|---|---|---|
| `cockpit` | 80 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  cockpit:
    image: cockpithq/cockpit:core-2.11.0
    ports:
      - "80"
    environment:
      - COCKPIT_SESSION_NAME=cockpit
      - COCKPIT_SALT=${SALT}
      - COCKPIT_DATABASE_SERVER=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017
      - COCKPIT_DATABASE_NAME=cockpit
    volumes:
      - html:/var/www/html
      - data:/var/www/html/storage/data
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
  html:
  data:
  mongo-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
