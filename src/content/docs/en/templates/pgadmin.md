---
title: Host pgAdmin with Rustploy
description: "The official and most popular graphical interface for managing PostgreSQL databases. Create pgAdmin in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**pgAdmin**: The official and most popular graphical interface for managing PostgreSQL databases. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pgadmin` |
| **Containers** | 1 (`pgadmin`) |
| **Images** | `dpage/pgadmin4:latest` |
| **UI port** | 80, on service `pgadmin` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **pgAdmin** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_email` | user@example.com |
| `admin_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PGADMIN_DEFAULT_EMAIL` | ${admin_email} |
| `PGADMIN_DEFAULT_PASSWORD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `pgadmin` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  pgadmin:
    image: dpage/pgadmin4:latest
    restart: unless-stopped
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_DEFAULT_EMAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_DEFAULT_PASSWORD}
      - PGADMIN_CONFIG_SERVER_MODE=False
      - PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED=False
    volumes:
      - pgadmin-data:/var/lib/pgadmin

volumes:
  pgadmin-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
