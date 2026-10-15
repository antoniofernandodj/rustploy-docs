---
title: Host Argilla with Rustploy
description: "Platform for data curation and Machine Learning workflows. Create Argilla in one click on Rustploy: 5 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Argilla**: Platform for data curation and Machine Learning workflows. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `argilla` |
| **Containers** | 5 (`argilla-web`, `argilla-worker`, `argilla-elasticsearch`, `argilla-db`, `argilla-redis`) |
| **Images** | `argilla/argilla-server:latest`, `docker.elastic.co/elasticsearch/elasticsearch:8.12.2`, `postgres:15-alpine`, `redis:7-alpine` |
| **UI port** | 6900, on service `argilla-web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Argilla** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `login_username` | *generated username* |
| `login_password` | *random password, 8 characters* |
| `db_password` | *random password, 16 characters* |
| `redis_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LOGIN_USERNAME` | ${login_username} |
| `LOGIN_PASSWORD` | ${login_password} |
| `DB_PASSWORD` | ${db_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `BACKGROUND_NUM_WORKERS` | 2 |

## Domains

| Service | Port | Host |
|---|---|---|
| `argilla-web` | 6900 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  argilla-web:
    image: argilla/argilla-server:latest
    restart: unless-stopped
    ports:
      - 6900
    environment:
      - ARGILLA_HOME_PATH=/var/lib/argilla
      - ARGILLA_ELASTICSEARCH=http://argilla-elasticsearch:9200
      - ARGILLA_DATABASE_URL=postgresql+asyncpg://postgres:${DB_PASSWORD}@argilla-db:5432/argilla
      - ARGILLA_REDIS_URL=redis://:${REDIS_PASSWORD}@argilla-redis:6379/0
      - USERNAME=${LOGIN_USERNAME}
      - PASSWORD=${LOGIN_PASSWORD}
      - API_KEY=argilla.apikey
      - WORKSPACE=default
    volumes:
      - argilladata:/var/lib/argilla
    depends_on:
      - argilla-elasticsearch
      - argilla-db
      - argilla-redis

  argilla-worker:
    image: argilla/argilla-server:latest
    restart: unless-stopped
    environment:
      - BACKGROUND_NUM_WORKERS=2
      - ARGILLA_HOME_PATH=/var/lib/argilla
      - ARGILLA_ELASTICSEARCH=http://argilla-elasticsearch:9200
      - ARGILLA_DATABASE_URL=postgresql+asyncpg://postgres:${DB_PASSWORD}@argilla-db:5432/argilla
      - ARGILLA_REDIS_URL=redis://:${REDIS_PASSWORD}@argilla-redis:6379/0
    volumes:
      - argilladata:/var/lib/argilla
    command: python -m argilla_server worker --num-workers ${BACKGROUND_NUM_WORKERS}
    depends_on:
      - argilla-elasticsearch
      - argilla-db
      - argilla-redis

  argilla-elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    restart: unless-stopped
    environment:
      - node.name=elasticsearch
      - cluster.name=es-argilla-local
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - cluster.routing.allocation.disk.threshold_enabled=false
      - xpack.security.enabled=false
    volumes:
      - elasticdata:/usr/share/elasticsearch/data

  argilla-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=argilla
    volumes:
      - dbdata:/var/lib/postgresql/data

  argilla-redis:
    image: redis:7-alpine
    restart: unless-stopped
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redisdata:/data

volumes:
  argilladata: {}
  elasticdata: {}
  dbdata: {}
  redisdata: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
