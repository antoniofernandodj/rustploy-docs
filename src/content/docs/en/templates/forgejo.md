---
title: Host Forgejo with Rustploy
description: "Lightweight, independent platform for hosting Git code. Create Forgejo in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Forgejo**: Lightweight, independent platform for hosting Git code. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `forgejo` |
| **Containers** | 2 (`forgejo`, `db`) |
| **Images** | `codeberg.org/forgejo/forgejo:10`, `postgres:17` |
| **UI port** | 3000, on service `forgejo` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Forgejo** and select it.
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
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |

## Domains

| Service | Port | Host |
|---|---|---|
| `forgejo` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  forgejo:
    image: codeberg.org/forgejo/forgejo:10
    environment:
      - USER_UID=${USER_UID}
      - USER_GID=${USER_GID}
      - FORGEJO__database__DB_TYPE=postgres
      - FORGEJO__database__HOST=db:5432
      - FORGEJO__database__NAME=forgejo
      - FORGEJO__database__USER=forgejo
      - FORGEJO__database__PASSWD=forgejo
    restart: always

    volumes:
      - forgejo_server:/data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    depends_on:
      - db

  db:
    image: postgres:17
    restart: always
    environment:
      - POSTGRES_USER=forgejo
      - POSTGRES_PASSWORD=forgejo
      - POSTGRES_DB=forgejo

    volumes:
      - forgejo_db:/var/lib/postgresql/data

volumes:
  forgejo_db:
    driver: local
  forgejo_server:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
