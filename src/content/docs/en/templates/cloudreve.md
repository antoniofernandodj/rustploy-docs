---
title: Host Cloudreve with Rustploy
description: "Multi-cloud file management and sharing system. Create Cloudreve in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cloudreve**: Multi-cloud file management and sharing system. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cloudreve` |
| **Containers** | 3 (`cloudreve`, `postgresql`, `redis`) |
| **Images** | `cloudreve/cloudreve:4.10.1`, `postgres:17`, `redis:8.4.0` |
| **UI port** | 5212, on service `cloudreve` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cloudreve** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `db_user` | cloudreve |
| `db_name` | cloudreve |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${db_password} |
| `POSTGRES_USER` | ${db_user} |
| `POSTGRES_DB` | ${db_name} |

## Domains

| Service | Port | Host |
|---|---|---|
| `cloudreve` | 5212 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  cloudreve:
    image: cloudreve/cloudreve:4.10.1
    depends_on:
      postgresql:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    environment:
      - CR_CONF_Database.Type=postgres
      - CR_CONF_Database.Host=postgresql
      - CR_CONF_Database.User=${POSTGRES_USER}
      - CR_CONF_Database.Password=${POSTGRES_PASSWORD}
      - CR_CONF_Database.Name=${POSTGRES_DB}
      - CR_CONF_Database.Port=5432
      - CR_CONF_Redis.Server=redis:6379
    volumes:
      - cloudreve_data:/cloudreve/data

  postgresql:
    image: postgres:17
    restart: unless-stopped
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:8.4.0
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  cloudreve_data:
  postgres_data:
  redis_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
