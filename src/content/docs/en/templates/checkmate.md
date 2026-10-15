---
title: Host Checkmate with Rustploy
description: "Real-time monitor of hardware, server uptime and incidents. Create Checkmate in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Checkmate**: Real-time monitor of hardware, server uptime and incidents. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `checkmate` |
| **Containers** | 2 (`server`, `mongodb`) |
| **Images** | `ghcr.io/bluewave-labs/checkmate-backend-mono:latest`, `ghcr.io/bluewave-labs/checkmate-mongo:latest` |
| **UI port** | 52345, on service `server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Checkmate** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `UPTIME_APP_API_BASE_URL` | http://${main_domain}:52345/api/v1 |
| `UPTIME_APP_CLIENT_HOST` | http://${main_domain} |
| `DB_CONNECTION_STRING` | mongodb://mongodb:27017/uptime_db?replicaSet=rs0 |
| `REDIS_URL` | redis://redis:6379 |
| `CLIENT_HOST` | http://${main_domain} |
| `JWT_SECRET` | *generated JWT* |

## Domains

| Service | Port | Host |
|---|---|---|
| `server` | 52345 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  server:
    image: ghcr.io/bluewave-labs/checkmate-backend-mono:latest
    restart: always
    ports:
      - 52345
    environment:
      - UPTIME_APP_API_BASE_URL=${UPTIME_APP_API_BASE_URL}
      - UPTIME_APP_CLIENT_HOST=${UPTIME_APP_CLIENT_HOST}
      - DB_CONNECTION_STRING=${DB_CONNECTION_STRING}
      - REDIS_URL=${REDIS_URL}
      - CLIENT_HOST=${CLIENT_HOST}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  mongodb:
    image: ghcr.io/bluewave-labs/checkmate-mongo:latest
    restart: always
    command: ["mongod", "--quiet", "--replSet", "rs0", "--bind_ip_all"]
    volumes:
      - ../files/mongo-data:/data/db
    healthcheck:
      test: echo "try { rs.status() } catch (err) { rs.initiate({_id:'rs0',members:[{_id:0,host:'mongodb:27017'}]}) }" | mongosh --port 27017 --quiet
      interval: 5s
      timeout: 30s
      start_period: 0s
      start_interval: 1s
      retries: 30
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
