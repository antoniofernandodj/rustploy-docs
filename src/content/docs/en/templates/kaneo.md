---
title: Host Kaneo with Rustploy
description: "Clean, simplified project management platform. Create Kaneo in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Kaneo**: Clean, simplified project management platform. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kaneo` |
| **Containers** | 3 (`postgres`, `backend`, `frontend`) |
| **Images** | `postgres:16-alpine`, `ghcr.io/usekaneo/api:latest`, `ghcr.io/usekaneo/web:latest` |
| **UI port** | 5173, on service `frontend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Kaneo** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `backend_domain` | *domain (generated; replace it with yours)* |
| `frontend_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BACKEND_HOST` | ${backend_domain} |
| `KANEO_DB` | kaneo |
| `KANEO_DB_USER` | *generated username* |
| `KANEO_DB_PASSWORD` | *random password* |
| `KANEO_JWT_ACCESS` | *random hash* |

## Domains

| Service | Port | Host |
|---|---|---|
| `frontend` | 5173 | ${frontend_domain} |
| `backend` | 1337 | ${backend_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${KANEO_DB}
      POSTGRES_USER: ${KANEO_DB_USER}
      POSTGRES_PASSWORD: ${KANEO_DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    image: ghcr.io/usekaneo/api:latest
    environment:
      JWT_ACCESS: ${KANEO_JWT_ACCESS}
      DATABASE_URL: "postgresql://${KANEO_DB_USER}:${KANEO_DB_PASSWORD}@postgres:5432/${KANEO_DB}"
    ports:
      - 1337
    depends_on:
      postgres:
        condition: service_started
    restart: unless-stopped

  frontend:
    image: ghcr.io/usekaneo/web:latest
    environment:
      KANEO_API_URL: "http://${BACKEND_HOST}"
    ports:
      - 5173
    depends_on:
      backend:
        condition: service_started
    restart: unless-stopped

volumes:
  postgres_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
