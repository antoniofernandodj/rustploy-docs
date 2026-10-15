---
title: Host Ojs with Rustploy
description: "Ojs application. Create Ojs in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ojs**: Ojs application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ojs` |
| **Containers** | 2 (`db`, `ojs`) |
| **Images** | `mariadb:11.4`, `pkpofficial/ojs:3_3_0-21` |
| **UI port** | 80, on service `ojs` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ojs** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `ojs_password` | *random password, 16 characters* |
| `mysql_root_password` | *random password, 16 characters* |
| `ojs_db_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `COMPOSE_PROJECT_NAME` | ojs |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |
| `OJS_DB_NAME` | ojs |
| `OJS_DB_USER` | ojs |
| `OJS_DB_PASSWORD` | ${ojs_db_password} |
| `OJS_DB_HOST` | db |
| `OJS_DB_DRIVER` | mysqli |
| `OJS_CLI_INSTALL` | 0 |

## Domains

| Service | Port | Host |
|---|---|---|
| `ojs` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: mariadb:11.4
    environment:
      MYSQL_ROOT_PASSWORD: "${MYSQL_ROOT_PASSWORD}"
      MYSQL_DATABASE: "${OJS_DB_NAME}"
      MYSQL_USER: "${OJS_DB_USER}"
      MYSQL_PASSWORD: "${OJS_DB_PASSWORD}"
    volumes:
      - ojs-db-data:/var/lib/mysql
    restart: unless-stopped

  ojs:
    image: "pkpofficial/ojs:3_3_0-21"
    hostname: "${COMPOSE_PROJECT_NAME}"
    ports:
      - 80
      - 443
    volumes:
      - /etc/localtime:/etc/localtime
      - ojs-private-files:/var/www/files
      - ojs-public-files:/var/www/html/public
    depends_on:
      - db
    restart: unless-stopped

volumes:
  ojs-db-data: {}
  ojs-private-files: {}
  ojs-public-files: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
