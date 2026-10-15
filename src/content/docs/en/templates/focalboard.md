---
title: Host Focalboard with Rustploy
description: "Kanban-style task manager (Trello/Asana alternative). Create Focalboard in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Focalboard**: Kanban-style task manager (Trello/Asana alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `focalboard` |
| **Containers** | 2 (`focalboard`, `postgres`) |
| **Images** | `mattermost/focalboard:7.11.4`, `postgres:17` |
| **UI port** | 8000, on service `focalboard` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Focalboard** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `VIRTUAL_HOST` | ${main_domain} |
| `VIRTUAL_PORT` | 8000 # Do Not Alter |
| `DB_TYPE` | postgres |
| `POSTGRES_USER` | focalboard |
| `POSTGRES_PASSWORD` | *random password, 32 characters* |
| `POSTGRES_DB` | focalboard |

## Domains

| Service | Port | Host |
|---|---|---|
| `focalboard` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3'

services:
  focalboard:
    image: mattermost/focalboard:7.11.4
    restart: unless-stopped
    volumes:
      - focalboardData:/opt/focalboard/data
    environment:
      - VIRTUAL_HOST
      - VIRTUAL_PORT
      - DB_TYPE
      - DB_CONFIG=postgres://${POSTGRES_USER}:${POSTGRES_password}@postgres:5432/${postgres_db}?sslmode=disable

  postgres:
    image: postgres:17
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - ./postgres_data:/var/lib/postgresql/data

volumes:
  focalboardData:
    driver: local
  focalboardPostgre:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
