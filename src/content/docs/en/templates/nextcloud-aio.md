---
title: Host Nextcloud Aio with Rustploy
description: "Nextcloud Aio application. Create Nextcloud Aio in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Nextcloud Aio**: Nextcloud Aio application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `nextcloud-aio` |
| **Containers** | 3 (`nextcloud`, `nextcloud_db`, `nextcloud_redis`) |
| **Images** | `nextcloud:stable`, `mariadb:10.11`, `redis:alpine` |
| **UI port** | 80, on service `nextcloud` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Nextcloud Aio** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `domain_name` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |
| `db_root_password` | *random password, 32 characters* |
| `region` | DE |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MYSQL_PASSWORD` | ${db_password} |
| `MYSQL_ROOT_PASSWORD` | ${db_root_password} |
| `DEFAULT_PHONE_REGION` | ${region} |
| `NEXTCLOUD_DOMAIN` | ${domain_name} |
| `OVERWRITEPROTOCOL` | https |
| `TRUSTED_PROXIES` | 10.0.0.0/8 172.16.0.0/12 |
| `REDIS_HOST` | nextcloud_redis |
| `MYSQL_DATABASE` | nextcloud |
| `MYSQL_USER` | nextcloud |

## Domains

| Service | Port | Host |
|---|---|---|
| `nextcloud` | 80 | ${domain_name} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `fix-nextcloud.sh`

## The template docker-compose.yml

```yaml
services:
  nextcloud:
    image: nextcloud:stable
    restart: always
    volumes:
      - nextcloud_data:/var/www/html
      - ../files/fix-nextcloud.sh:/usr/local/bin/fix-nextcloud.sh:ro
    environment:
      - MYSQL_HOST=nextcloud_db
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    depends_on:
      - nextcloud_db
      - nextcloud_redis

  nextcloud_db:
    image: mariadb:10.11
    restart: always
    volumes:
      - nextcloud_db_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}

  nextcloud_redis:
    image: redis:alpine
    restart: always

volumes:
  nextcloud_data:
  nextcloud_db_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
