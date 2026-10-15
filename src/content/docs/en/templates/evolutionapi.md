---
title: Host Evolution API with Rustploy
description: "WhatsApp API focused on automation for small businesses. Create Evolution API in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Evolution API**: WhatsApp API focused on automation for small businesses. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `evolutionapi` |
| **Containers** | 3 (`evolution-api`, `evolution-postgres`, `evolution-redis`) |
| **Images** | `evoapicloud/evolution-api:latest`, `postgres:16-alpine`, `redis:alpine` |
| **UI port** | 8080, on service `evolution-api` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Evolution API** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_key` | *random base64 key (64 bytes)* |
| `postgres_password` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SERVER_URL` | https://${main_domain} |
| `AUTHENTICATION_TYPE` | apikey |
| `AUTHENTICATION_API_KEY` | ${api_key} |
| `AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES` | true |
| `LANGUAGE` | en |
| `CONFIG_SESSION_PHONE_CLIENT` | Evolution API |
| `CONFIG_SESSION_PHONE_NAME` | Chrome |
| `TELEMETRY` | false |
| `TELEMETRY_URL` |  |
| `POSTGRES_DATABASE` | evolution |
| `POSTGRES_USERNAME` | postgresql |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `DATABASE_ENABLED` | true |
| `DATABASE_PROVIDER` | postgresql |
| `DATABASE_CONNECTION_URI` | postgres://postgresql:${postgres_password}@evolution-postgres:5432/evolution |
| `DATABASE_SAVE_DATA_INSTANCE` | true |
| `DATABASE_SAVE_DATA_NEW_MESSAGE` | true |
| `DATABASE_SAVE_MESSAGE_UPDATE` | true |
| `DATABASE_SAVE_DATA_CONTACTS` | true |
| `DATABASE_SAVE_DATA_CHATS` | true |
| `DATABASE_SAVE_DATA_LABELS` | true |
| `DATABASE_SAVE_DATA_HISTORIC` | true |
| `CACHE_REDIS_ENABLED` | true |
| `CACHE_REDIS_URI` | redis://evolution-redis:6379 |
| `CACHE_REDIS_PREFIX_KEY` | evolution |
| `CACHE_REDIS_SAVE_INSTANCES` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `evolution-api` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  evolution-api:
    image: evoapicloud/evolution-api:latest
    restart: always
    volumes:
      - evolution-instances:/evolution/instances

    environment:
      - SERVER_URL=${SERVER_URL}
      - AUTHENTICATION_TYPE=${AUTHENTICATION_TYPE}
      - AUTHENTICATION_API_KEY=${AUTHENTICATION_API_KEY}
      - AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=${AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES}
      - LANGUAGE=${LANGUAGE}
      - CONFIG_SESSION_PHONE_CLIENT=${CONFIG_SESSION_PHONE_CLIENT}
      - CONFIG_SESSION_PHONE_NAME=${CONFIG_SESSION_PHONE_NAME}
      - TELEMETRY=${TELEMETRY}
      - TELEMETRY_URL=${TELEMETRY_URL}
      - DATABASE_ENABLED=${DATABASE_ENABLED}
      - DATABASE_PROVIDER=${DATABASE_PROVIDER}
      - DATABASE_CONNECTION_URI=${DATABASE_CONNECTION_URI}
      - DATABASE_SAVE_DATA_INSTANCE=${DATABASE_SAVE_DATA_INSTANCE}
      - DATABASE_SAVE_DATA_NEW_MESSAGE=${DATABASE_SAVE_DATA_NEW_MESSAGE}
      - DATABASE_SAVE_MESSAGE_UPDATE=${DATABASE_SAVE_MESSAGE_UPDATE}
      - DATABASE_SAVE_DATA_CONTACTS=${DATABASE_SAVE_DATA_CONTACTS}
      - DATABASE_SAVE_DATA_CHATS=${DATABASE_SAVE_DATA_CHATS}
      - DATABASE_SAVE_DATA_LABELS=${DATABASE_SAVE_DATA_LABELS}
      - DATABASE_SAVE_DATA_HISTORIC=${DATABASE_SAVE_DATA_HISTORIC}
      - CACHE_REDIS_ENABLED=${CACHE_REDIS_ENABLED}
      - CACHE_REDIS_URI=${CACHE_REDIS_URI}
      - CACHE_REDIS_PREFIX_KEY=${CACHE_REDIS_PREFIX_KEY}
      - CACHE_REDIS_SAVE_INSTANCES=${CACHE_REDIS_SAVE_INSTANCES}

  evolution-postgres:
    image: postgres:16-alpine
    restart: always
    volumes:
      - evolution-postgres-data:/var/lib/postgresql/data

    environment:
      - POSTGRES_DB=${POSTGRES_DATABASE}
      - POSTGRES_USER=${POSTGRES_USERNAME}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

  evolution-redis:
    image: redis:alpine
    restart: always
    volumes:
      - evolution-redis-data:/data

volumes:
  evolution-instances:
  evolution-postgres-data:
  evolution-redis-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
