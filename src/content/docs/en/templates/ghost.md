---
title: Host Ghost with Rustploy
description: "Professional, modern platform for publishing blogs and newsletters. Create Ghost in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ghost**: Professional, modern platform for publishing blogs and newsletters. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ghost` |
| **Containers** | 2 (`ghost`, `db`) |
| **Images** | `ghost:6-alpine`, `mysql:8.0` |
| **UI port** | 2368, on service `ghost` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ghost** and select it.
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
| `GHOST_HOST` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ghost` | 2368 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  ghost:
    image: ghost:6-alpine
    restart: always
    environment:
      database__client: mysql
      database__connection__host: db
      database__connection__user: root
      database__connection__password: example
      database__connection__database: ghost
      url: http://${GHOST_HOST}

    volumes:
      - ghost:/var/lib/ghost/content

  db:
    image: mysql:8.0
    restart: always

    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - db:/var/lib/mysql

volumes:
  ghost:
  db:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
