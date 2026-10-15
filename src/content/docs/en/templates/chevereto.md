---
title: Host Chevereto with Rustploy
description: "Robust platform for hosting and sharing images and videos. Create Chevereto in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Chevereto**: Robust platform for hosting and sharing images and videos. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `chevereto` |
| **Containers** | 2 (`chevereto`, `mysql`) |
| **Images** | `chevereto/chevereto:4`, `mysql:8` |
| **UI port** | 80, on service `chevereto` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Chevereto** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DB_PASSWORD` | ${db_password} |
| `DOMAIN` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `chevereto` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  chevereto:
    image: chevereto/chevereto:4
    restart: unless-stopped
    environment:
      - CHEVERETO_DB_HOST=mysql
      - CHEVERETO_DB_USER=mysql
      - CHEVERETO_DB_PASS=${DB_PASSWORD}
      - CHEVERETO_DB_PORT=3306
      - CHEVERETO_DB_NAME=chevereto
      - CHEVERETO_HOSTNAME=${DOMAIN}
      - CHEVERETO_HOSTNAME_PATH=/
      - CHEVERETO_HTTPS=0
      - CHEVERETO_MAX_POST_SIZE=2G
      - CHEVERETO_MAX_UPLOAD_SIZE=2G
    ports:
      - 80
    volumes:
      - storage:/var/www/html/images/
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=chevereto
      - MYSQL_USER=mysql
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql:/var/lib/mysql

volumes:
  storage:
  mysql:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
