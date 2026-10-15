---
title: Host Rybbit with Rustploy
description: "Alternative web analytics aiming to be more readable and clean than classic Google Analytics. Create Rybbit in one click on Rustploy: 4 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Rybbit**: Alternative web analytics aiming to be more readable and clean than classic Google Analytics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rybbit` |
| **Containers** | 4 (`rybbit_clickhouse`, `rybbit_postgres`, `rybbit_backend`, `rybbit_client`) |
| **Images** | `clickhouse/clickhouse-server:25.5`, `postgres:17.5`, `ghcr.io/rybbit-io/rybbit-backend:v1.5.1`, `ghcr.io/rybbit-io/rybbit-client:v1.5.1` |
| **UI port** | 3001, on service `rybbit_backend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Rybbit** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `better_auth_secret` | *random password, 32 characters* |
| `clickhouse_password` | *random password, 32 characters* |
| `postgres_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BASE_URL` | http://${main_domain} |
| `DOMAIN_NAME` | ${main_domain} |
| `BETTER_AUTH_SECRET` | ${better_auth_secret} |
| `DISABLE_SIGNUP` | false |
| `CLICKHOUSE_DB` | analytics |
| `CLICKHOUSE_USER` | default |
| `CLICKHOUSE_PASSWORD` | ${clickhouse_password} |
| `POSTGRES_DB` | analytics |
| `POSTGRES_USER` | frog |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `rybbit_backend` | 3001 | ${main_domain} |
| `rybbit_client` | 3002 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./clickhouse_config/enable_json.xml`
- `./clickhouse_config/logging_rules.xml`
- `./clickhouse_config/network.xml`
- `./clickhouse_config/user_logging.xml`

## The template docker-compose.yml

```yaml
# https://www.rybbit.io/docs/self-hosting-advanced

# NOTE: there are two sample HTTP traefik domain entries created:
# - rybbit_backend (port 3001, path /api), 
# - rybbit_client (port 3002, path /)
#
# You should treat these as placeholders - Rybbit only supports HTTPS.
#
# You should also update the `BASE_URL`, and `DOMAIN_NAME` environment
# variable when updating the domain entries with your custom domain.

services:
  rybbit_clickhouse:
    image: clickhouse/clickhouse-server:25.5
    volumes:
      - clickhouse_data:/var/lib/clickhouse
      - ../files/clickhouse_config:/etc/clickhouse-server/config.d
    environment:
      - CLICKHOUSE_DB=${CLICKHOUSE_DB}
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--no-verbose",
          "--tries=1",
          "--spider",
          "http://localhost:8123/ping",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  rybbit_postgres:
    image: postgres:17.5
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  rybbit_backend:
    image: ghcr.io/rybbit-io/rybbit-backend:v1.5.1
    environment:
      - NODE_ENV=production
      - CLICKHOUSE_HOST=http://rybbit_clickhouse:8123
      - CLICKHOUSE_DB=${CLICKHOUSE_DB}
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
      - POSTGRES_HOST=rybbit_postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BASE_URL=${BASE_URL}
      - DOMAIN_NAME=${DOMAIN_NAME}
      - DISABLE_SIGNUP=${DISABLE_SIGNUP}
    depends_on:
      rybbit_clickhouse:
        condition: service_healthy
      rybbit_postgres:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://127.0.0.1:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
    restart: unless-stopped

  rybbit_client:
    image: ghcr.io/rybbit-io/rybbit-client:v1.5.1
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BACKEND_URL=${BASE_URL}
      - DOMAIN_NAME=${DOMAIN_NAME}
      - NEXT_PUBLIC_DISABLE_SIGNUP=${DISABLE_SIGNUP}
    depends_on:
      - rybbit_backend
    restart: unless-stopped

volumes:
  clickhouse_data:
  postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
