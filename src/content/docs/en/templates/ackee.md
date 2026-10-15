---
title: Host Ackee with Rustploy
description: "Privacy-focused analytics for websites. Create Ackee in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ackee**: Privacy-focused analytics for websites. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ackee` |
| **Containers** | 2 (`ackee`, `mongo`) |
| **Images** | `electerious/ackee:3.4.2`, `mongo:4` |
| **UI port** | 3000, on service `ackee` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ackee** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `ACKEE_USERNAME` | default |
| `ACKEE_PASSWORD` | *random password, 16 characters* |
| `MONGO_INITDB_ROOT_PASSWORD` | *random password, 16 characters* |
| `ACKEE_MONGODB` | mongodb://mongo:${MONGO_INITDB_ROOT_PASSWORD}@mongo:27017 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ACKEE_USERNAME` | ${ACKEE_USERNAME} |
| `ACKEE_PASSWORD` | ${ACKEE_PASSWORD} |
| `ACKEE_MONGODB` | ${ACKEE_MONGODB} |
| `MONGO_INITDB_ROOT_PASSWORD` | ${MONGO_INITDB_ROOT_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ackee` | 3000 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  ackee:
    image: electerious/ackee:3.4.2
    ports:
      - "3000"
    environment:
      - ACKEE_USERNAME=${ACKEE_USERNAME}
      - ACKEE_PASSWORD=${ACKEE_PASSWORD}
      - ACKEE_MONGODB=${ACKEE_MONGODB}
  
  mongo:
    image: mongo:4
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
      - MONGO_INITDB_ROOT_USERNAME=mongo
    volumes:
      - mongo-data:/data/db


volumes:
  mongo-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
