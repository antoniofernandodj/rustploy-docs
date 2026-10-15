---
title: Host Lowcoder with Rustploy
description: "Fast visual builder for enterprise applications and data dashboards. Create Lowcoder in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Lowcoder**: Fast visual builder for enterprise applications and data dashboards. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `lowcoder` |
| **Containers** | 1 (`lowcoder-api-service`) |
| **Images** | `lowcoderorg/lowcoder-ce:2.6.4` |
| **UI port** | 3000, on service `lowcoder-api-service` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Lowcoder** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `encryption_password` | *random password, 32 characters* |
| `encryption_salt` | *random password, 32 characters* |
| `api_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ENABLE_USER_SIGN_UP` | false |
| `ENCRYPTION_PASSWORD` | ${encryption_password} |
| `ENCRYPTION_SALT` | ${encryption_salt} |
| `CORS_ALLOWED_DOMAINS` | * |
| `LOWCODER_API_KEY_SECRET` | ${api_secret} |

## Domains

| Service | Port | Host |
|---|---|---|
| `lowcoder-api-service` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3"

services:
  ## Start Lowcoder (all-in-one)
  lowcoder-api-service:
    image: lowcoderorg/lowcoder-ce:2.6.4
    environment:
      REDIS_ENABLED: "true"
      MONGODB_ENABLED: "true"
      API_SERVICE_ENABLED: "true"
      NODE_SERVICE_ENABLED: "true"
      FRONTEND_ENABLED: "true"
      PUID: "1000"
      PGID: "1000"
      DEFAULT_ORGS_PER_USER: 100
      DEFAULT_ORG_MEMBER_COUNT: 1000
      DEFAULT_ORG_GROUP_COUNT: 100
      DEFAULT_ORG_APP_COUNT: 1000
      DEFAULT_DEVELOPER_COUNT: 50
      MONGODB_URL: "mongodb://localhost:27017/lowcoder?authSource=admin"
      REDIS_URL: "redis://localhost:6379"
      ENABLE_USER_SIGN_UP: ${ENABLE_USER_SIGN_UP}
      ENCRYPTION_PASSWORD: ${ENCRYPTION_PASSWORD}
      ENCRYPTION_SALT: ${ENCRYPTION_SALT}
      CORS_ALLOWED_DOMAINS: ${CORS_ALLOWED_DOMAINS}
      LOWCODER_API_KEY_SECRET: ${LOWCODER_API_KEY_SECRET}
      LOWCODER_API_SERVICE_URL: "http://localhost:8080"
      LOWCODER_NODE_SERVICE_URL: "http://localhost:6060"
    volumes:
      - ../files/volumes/lowcoder-stacks:/lowcoder-stacks
    restart: unless-stopped
    expose: 
      - 3000
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
