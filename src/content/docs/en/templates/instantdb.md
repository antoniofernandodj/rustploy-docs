---
title: Host InstantDB with Rustploy
description: "Real-time database with instant state sync across clients. Create InstantDB in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**InstantDB**: Real-time database with instant state sync across clients. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `instantdb` |
| **Containers** | 2 (`postgres`, `server`) |
| **Images** | `ghcr.io/instantdb/postgresql:postgresql-16-pg-hint-plan`, `hari1367709/instantdb-server:latest` |
| **UI port** | 8888, on service `server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **InstantDB** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `postgres_user` | instant |
| `postgres_db` | instant |
| `aws_access_key_id` | FILL-YOUR-CREDENTIALS |
| `aws_secret_access_key` | FILL-YOUR-CREDENTIALS |
| `aws_region` | us-east-1 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_DB` | ${postgres_db} |
| `DATABASE_URL` | postgresql://${postgres_user}:${postgres_password}@postgres:5432/${postgres_db} |
| `NREPL_BIND_ADDRESS` | 0.0.0.0 |
| `PORT` | 8888 |
| `HOST` | 0.0.0.0 |
| `AWS_ACCESS_KEY_ID` | ${aws_access_key_id} |
| `AWS_SECRET_ACCESS_KEY` | ${aws_secret_access_key} |
| `AWS_REGION` | ${aws_region} |

## Domains

| Service | Port | Host |
|---|---|---|
| `server` | 8888 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: ghcr.io/instantdb/postgresql:postgresql-16-pg-hint-plan
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - backend-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    command:
      - "postgres"
      - "-c"
      - "wal_level=logical"
      - "-c"
      - "max_replication_slots=4"
      - "-c"
      - "max_wal_senders=4"
      - "-c"
      - "shared_preload_libraries=pg_hint_plan"
      - "-c"
      - "random_page_cost=1.1"
  server:
    depends_on:
      postgres:
        condition: service_healthy
    image: hari1367709/instantdb-server:latest
    restart: unless-stopped
    working_dir: /app
    environment:
      DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"
      NREPL_BIND_ADDRESS: "0.0.0.0"
      PORT: "8888"
      HOST: "0.0.0.0"
      # AWS Credentials for KMS (required for InstantDB)
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION:-us-east-1}
      # Force unbuffered output for logs
      PYTHONUNBUFFERED: "1"
      NODE_ENV: "production"
    command: ["java", "-Djava.awt.headless=true", "-server", "-jar", "target/instant-standalone.jar"]
    ports:
      - "8888"
      - "6005"
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8888/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
volumes:
  backend-db:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
