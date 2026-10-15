---
title: Host Maybe with Rustploy
description: "Modern private app for tracking finances and household expenses. Create Maybe in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Maybe**: Modern private app for tracking finances and household expenses. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `maybe` |
| **Containers** | 2 (`app`, `db`) |
| **Images** | `ghcr.io/maybe-finance/maybe:sha-68c570eed8810fd59b5b33cca51bbad5eabb4cb4`, `postgres:16` |
| **UI port** | 3000, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Maybe** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key_base` | *random base64 key (64 bytes)* |
| `synth_api_key` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SECRET_KEY_BASE` | ${secret_key_base} |
| `SELF_HOSTED` | true |
| `SYNTH_API_KEY` | ${synth_api_key} |
| `RAILS_FORCE_SSL` | false |
| `RAILS_ASSUME_SSL` | false |
| `GOOD_JOB_EXECUTION_MODE` | async |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./uploads`

## The template docker-compose.yml

```yaml
services:
  app:
    image: ghcr.io/maybe-finance/maybe:sha-68c570eed8810fd59b5b33cca51bbad5eabb4cb4
    restart: unless-stopped
    volumes:
      - ../files/uploads:/app/uploads
    environment:
      DATABASE_URL: postgresql://maybe:maybe@db:5432/maybe
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      SELF_HOSTED: true
      SYNTH_API_KEY: ${SYNTH_API_KEY}
      RAILS_FORCE_SSL: "false"
      RAILS_ASSUME_SSL: "false"
      GOOD_JOB_EXECUTION_MODE: async
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: maybe
      POSTGRES_USER: maybe
      POSTGRES_PASSWORD: maybe

volumes:
  db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
