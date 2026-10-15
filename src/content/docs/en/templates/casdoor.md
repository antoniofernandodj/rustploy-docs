---
title: Host Casdoor with Rustploy
description: "Identity and access management (IAM) hub supporting multiple protocols. Create Casdoor in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Casdoor**: Identity and access management (IAM) hub supporting multiple protocols. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `casdoor` |
| **Containers** | 2 (`casdoor`, `casdoor-db`) |
| **Images** | `casbin/casdoor:latest`, `postgres:16` |
| **UI port** | 8000, on service `casdoor` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Casdoor** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `postgres_password` | *random password, 32 characters* |
| `admin_password` | *random password, 16 characters* |
| `jwt_secret` | *random password, 64 characters* |
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `ADMIN_FIRST_LOGIN_PASSWD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `casdoor` | 8000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `app.conf`
- `init_data.json`

## The template docker-compose.yml

```yaml
services:
  casdoor:
    image: casbin/casdoor:latest
    environment:
      - RUNNING_IN_DOCKER=true
    volumes:
      - ../files/app.conf:/conf/app.conf
      - ../files/init_data.json:/init_data.json
      - casdoor-data:/data
    depends_on:
      casdoor-db:
        condition: service_healthy
    restart: unless-stopped

  casdoor-db:
    image: postgres:16
    environment:
      - POSTGRES_USER=casdoor
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=casdoor
    volumes:
      - casdoor-postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U casdoor -d casdoor"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  casdoor-postgres-data:
  casdoor-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
