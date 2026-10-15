---
title: Host Rote with Rustploy
description: "Personal note system built on native API calls. Create Rote in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Rote**: Personal note system built on native API calls. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rote` |
| **Containers** | 3 (`rote-backend`, `rote-frontend`, `rote-postgres`) |
| **Images** | `rabithua/rote-backend:${IMAGE_TAG:-latest}`, `rabithua/rote-frontend:${IMAGE_TAG:-latest}`, `postgres:17` |
| **UI port** | 80, on service `rote-frontend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Rote** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `frontend_domain` | *domain (generated; replace it with yours)* |
| `backend_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `image_tag` | latest |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `IMAGE_TAG` | ${image_tag} |
| `VITE_API_BASE` | http://${backend_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `rote-frontend` | 80 | ${frontend_domain} |
| `rote-backend` | 3000 | ${backend_domain} |

## The template docker-compose.yml

```yaml
services:
  rote-backend:
    image: rabithua/rote-backend:${IMAGE_TAG:-latest}
    pull_policy: always
    environment:
      POSTGRESQL_URL: postgresql://rote:${POSTGRES_PASSWORD}@rote-postgres:5432/rote
    depends_on:
      rote-postgres:
        condition: service_healthy
    restart: unless-stopped
    command:
      [
        "sh",
        "-c",
        "sleep 15 && bun run dist/scripts/runMigrations.js && bun run dist/server.js",
      ]

  rote-frontend:
    image: rabithua/rote-frontend:${IMAGE_TAG:-latest}
    pull_policy: always
    depends_on:
      - rote-backend
    environment:
      # VITE_API_BASE must point to an address that reaches rote-backend (reverse-proxy domain or host IP:port)
      VITE_API_BASE: ${VITE_API_BASE}
    restart: unless-stopped

  rote-postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      POSTGRES_USER: rote
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: rote
    volumes:
      - rote-postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rote -d rote"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 30s

volumes:
  rote-postgres-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
