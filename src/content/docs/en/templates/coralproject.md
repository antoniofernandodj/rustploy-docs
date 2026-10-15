---
title: Host Coralproject with Rustploy
description: "Coralproject application. Create Coralproject in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Coralproject**: Coralproject application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `coralproject` |
| **Containers** | 3 (`coral`, `mongo`, `redis`) |
| **Images** | `coralproject/talk:9.7.0`, `mongo:4`, `redis:6` |
| **UI port** | 3000, on service `coral` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Coralproject** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `DOMAIN` | *domain (generated; replace it with yours)* |
| `MONGO_PASSWORD` | *random password, 16 characters* |
| `REDIS_PASSWORD` | *random password, 16 characters* |
| `SIGNING_SECRET` | *random password, 45 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MONGODB_URI` | mongodb://mongo:${MONGO_PASSWORD}@mongo:27017 |
| `REDIS_URI` | redis://default:${REDIS_PASSWORD}@redis:6379 |
| `SIGNING_SECRET` | ${SIGNING_SECRET} |
| `NODE_ENV` | production |
| `MONGO_PASSWORD` | ${MONGO_PASSWORD} |
| `REDIS_PASSWORD` | ${REDIS_PASSWORD} |
| `MONGO_USER` | mongo |

## Domains

| Service | Port | Host |
|---|---|---|
| `coral` | 3000 | ${DOMAIN} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  coral:
    image: coralproject/talk:9.7.0
    ports:
      - "3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URI=${REDIS_URI}
      - SIGNING_SECRET=${SIGNING_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:4
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:6
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
