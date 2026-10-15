---
title: Host Superset with Rustploy
description: "Superset application. Create Superset in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Superset**: Superset application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `superset` |
| **Containers** | 3 (`superset`, `superset_postgres`, `superset_redis`) |
| **Images** | `amancevice/superset:6.0.0`, `postgres:18`, `redis:8` |
| **UI port** | 8088, on service `superset` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Superset** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password, 30 characters* |
| `postgres_password` | *random password, 30 characters* |
| `redis_password` | *random password, 30 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SECRET_KEY` | ${secret_key} |
| `MAPBOX_API_KEY` |  |
| `POSTGRES_DB` | superset |
| `POSTGRES_USER` | superset |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_PASSWORD` | ${redis_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `superset` | 8088 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./superset/superset_config.py`

## The template docker-compose.yml

```yaml
# This is an UNOFFICIAL production docker image build for Superset:
# - https://github.com/amancevice/docker-superset
#
#
# ## SETUP INSTRUCTIONS
#
# After deploying this image, you will need to run one of the two
# commands below in a terminal within the superset container:
#      $ superset-demo     # Initialise database + load demo charts/datasets
#      $ superset-init     # Initialise database only
#
# You will be prompted to enter the credentials for the admin user.
#
#
# ## NETWORK INSTRUCTIONS
#
# If you want to connect superset with other internal databases managed by
# Dokploy using internal hostnames, you will need to connect the `superset`
# container to those networks.
#

services:
  superset:
    image: amancevice/superset:6.0.0
    restart: unless-stopped
    #networks:
    #  - dokploy-network
    depends_on:
      - superset_postgres
      - superset_redis
    volumes:
      # This superset_config.py can be edited in Dokploy's UI Advanced -> Volume Mount
      - ../files/superset/superset_config.py:/etc/superset/superset_config.py
    environment:
      SECRET_KEY: ${SECRET_KEY}
      MAPBOX_API_KEY: ${MAPBOX_API_KEY}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      # Ensure the hosts matches your service names below.
      POSTGRES_HOST: superset_postgres
      REDIS_HOST: superset_redis

  superset_postgres:
    image: postgres:18
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - superset_postgres_data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 3

  superset_redis:
    image: redis:8
    restart: unless-stopped
    volumes:
      - superset_redis_data:/data
    command: redis-server --requirepass ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -a $${REDIS_PASSWORD} ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  superset_postgres_data:
  superset_redis_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
