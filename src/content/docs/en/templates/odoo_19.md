---
title: Host Odoo 19 with Rustploy
description: "Odoo 19 application. Create Odoo 19 in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Odoo 19**: Odoo 19 application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `odoo_19` |
| **Containers** | 2 (`web`, `db`) |
| **Images** | `odoo:19.0`, `postgres:17` |
| **UI port** | 8069, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Odoo 19** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 8069 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  web:
    image: odoo:19.0
    depends_on:
      - db
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo
    volumes:
      - odoo-web-data:/var/lib/odoo
      - ../files/config:/etc/odoo
      - ../files/addons:/mnt/extra-addons

  db:
    image: postgres:17
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo
    volumes:
      - odoo-db-data:/var/lib/postgresql/data

volumes:
  odoo-web-data:
  odoo-db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
