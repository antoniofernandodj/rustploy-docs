---
title: Host AdventureLog with Rustploy
description: "Activity tracker with Strava integration. Create AdventureLog in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AdventureLog**: Activity tracker with Strava integration. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `adventurelog` |
| **Containers** | 3 (`web`, `db`, `server`) |
| **Images** | `ghcr.io/seanmorley15/adventurelog-frontend:latest`, `postgis/postgis:16-3.5`, `ghcr.io/seanmorley15/adventurelog-backend:latest` |
| **UI port** | 3000, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AdventureLog** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `frontend_domain` | *domain (generated; replace it with yours)* |
| `backend_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 16 characters* |
| `secret_key` | *random password, 32 characters* |
| `admin_username` | admin |
| `admin_password` | *random password, 12 characters* |
| `admin_email` | *generated email* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PGHOST` | db |
| `POSTGRES_DB` | adventure |
| `POSTGRES_USER` | adventure |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `SECRET_KEY` | ${secret_key} |
| `DJANGO_ADMIN_USERNAME` | ${admin_username} |
| `DJANGO_ADMIN_PASSWORD` | ${admin_password} |
| `DJANGO_ADMIN_EMAIL` | ${admin_email} |
| `DEBUG` | False |
| `CSRF_TRUSTED_ORIGINS` | http://${backend_domain},http://${frontend_domain} |
| `FRONTEND_URL` | http://${frontend_domain} |
| `PUBLIC_URL` | http://${backend_domain} |
| `PUBLIC_SERVER_URL` | ${backend_domain} |
| `ORIGIN` | http://${frontend_domain} |
| `BODY_SIZE_LIMIT` | Infinity |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 3000 | ${frontend_domain} |
| `server` | 80 | ${backend_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  web:
    image: ghcr.io/seanmorley15/adventurelog-frontend:latest
    restart: unless-stopped
    depends_on:
      - server
    environment:
      # Frontend needs to know where the backend is
      PUBLIC_SERVER_URL: ${PUBLIC_SERVER_URL}
      ORIGIN: ${ORIGIN}
      BODY_SIZE_LIMIT: ${BODY_SIZE_LIMIT}

  db:
    image: postgis/postgis:16-3.5
    restart: unless-stopped
    volumes:
      - postgres_data:/var/lib/postgresql/data/
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  server:
    image: ghcr.io/seanmorley15/adventurelog-backend:latest
    restart: unless-stopped
    depends_on:
      - db
    volumes:
      - adventurelog_media:/code/media/
    environment:
      # DB settings for Django
      PGHOST: ${PGHOST}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

      # Django app settings
      SECRET_KEY: ${SECRET_KEY}
      DJANGO_ADMIN_USERNAME: ${DJANGO_ADMIN_USERNAME}
      DJANGO_ADMIN_PASSWORD: ${DJANGO_ADMIN_PASSWORD}
      DJANGO_ADMIN_EMAIL: ${DJANGO_ADMIN_EMAIL}
      DEBUG: ${DEBUG}
      CSRF_TRUSTED_ORIGINS: ${CSRF_TRUSTED_ORIGINS}
      FRONTEND_URL: ${FRONTEND_URL}
      PUBLIC_URL: ${PUBLIC_URL}

volumes:
  postgres_data: {}
  adventurelog_media: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
