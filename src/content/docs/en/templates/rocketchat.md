---
title: Host Rocketchat with Rustploy
description: "Complete ecosystem for corporate chat and internal communication. Create Rocketchat in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Rocketchat**: Complete ecosystem for corporate chat and internal communication. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rocketchat` |
| **Containers** | 2 (`rocketchat`, `mongodb`) |
| **Images** | `registry.rocket.chat/rocketchat/rocket.chat:6.9.2`, `docker.io/bitnami/mongodb:5.0` |
| **UI port** | 3000, on service `rocketchat` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Rocketchat** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ROCKETCHAT_HOST` | ${main_domain} |
| `ROCKETCHAT_PORT` | 3000 |

## Domains

| Service | Port | Host |
|---|---|---|
| `rocketchat` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  rocketchat:
    image: registry.rocket.chat/rocketchat/rocket.chat:6.9.2
    restart: always
    environment:
      MONGO_URL: "mongodb://mongodb:27017/rocketchat?replicaSet=rs0"
      MONGO_OPLOG_URL: "mongodb://mongodb:27017/local?replicaSet=rs0"
      ROOT_URL: ${ROOT_URL:-http://${ROCKETCHAT_HOST}:${ROCKETCHAT_PORT}}
      PORT: ${ROCKETCHAT_PORT}
      DEPLOY_METHOD: docker
      DEPLOY_PLATFORM:
      REG_TOKEN:
    depends_on:
      - mongodb

  mongodb:
    image: docker.io/bitnami/mongodb:5.0
    restart: always
    volumes:
      - mongodb_data:/bitnami/mongodb
    environment:
      MONGODB_REPLICA_SET_MODE: primary
      MONGODB_REPLICA_SET_NAME: rs0
      MONGODB_PORT_NUMBER: 27017
      MONGODB_INITIAL_PRIMARY_HOST: mongodb
      MONGODB_INITIAL_PRIMARY_PORT_NUMBER: 27017
      MONGODB_ADVERTISED_HOSTNAME: mongodb
      MONGODB_ENABLE_JOURNAL: true
      ALLOW_EMPTY_PASSWORD: yes


volumes:
  mongodb_data: { driver: local }
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
