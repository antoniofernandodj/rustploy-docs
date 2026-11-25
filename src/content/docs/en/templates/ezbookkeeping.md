---
title: Host EZBookkeeping with Rustploy
description: "Accounting manager for personal finances and micro-businesses. Create EZBookkeeping in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**EZBookkeeping**: Accounting manager for personal finances and micro-businesses. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ezbookkeeping` |
| **Containers** | 2 (`mysql`, `ezbookkeeping`) |
| **Images** | `mysql:8.0`, `mayswind/ezbookkeeping` |
| **UI port** | 8080, on service `ezbookkeeping` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **EZBookkeeping** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_name` | ezbookkeeping |
| `db_user` | ezbookkeeping |
| `db_pass` | *random password, 32 characters* |
| `root_pass` | *random password, 32 characters* |
| `secret_key` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MYSQL_ROOT_PASSWORD` | ${root_pass} |
| `MYSQL_DATABASE` | ${db_name} |
| `MYSQL_USER` | ${db_user} |
| `MYSQL_PASSWORD` | ${db_pass} |
| `EBK_SERVER_DOMAIN` | ${main_domain} |
| `EBK_SERVER_ENABLE_GZIP` | true |
| `EBK_DATABASE_TYPE` | mysql |
| `EBK_DATABASE_HOST` | mysql:3306 |
| `EBK_DATABASE_NAME` | ${db_name} |
| `EBK_DATABASE_USER` | ${db_user} |
| `EBK_DATABASE_PASSWD` | ${db_pass} |
| `EBK_LOG_MODE` | file |
| `EBK_SECURITY_SECRET_KEY` | ${secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ezbookkeeping` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
  ezbookkeeping:
    image: mayswind/ezbookkeeping
    restart: unless-stopped
    depends_on:
      - mysql
    environment:
      - EBK_SERVER_DOMAIN=${EBK_SERVER_DOMAIN}
      - EBK_SERVER_ENABLE_GZIP=${EBK_SERVER_ENABLE_GZIP}
      - EBK_DATABASE_TYPE=${EBK_DATABASE_TYPE}
      - EBK_DATABASE_HOST=${EBK_DATABASE_HOST}
      - EBK_DATABASE_NAME=${EBK_DATABASE_NAME}
      - EBK_DATABASE_USER=${EBK_DATABASE_USER}
      - EBK_DATABASE_PASSWD=${EBK_DATABASE_PASSWD}
      - EBK_LOG_MODE=${EBK_LOG_MODE}
      - EBK_SECURITY_SECRET_KEY=${EBK_SECURITY_SECRET_KEY}
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - storage:/ezbookkeeping/storage
      - logs:/ezbookkeeping/log
volumes:
  mysql-data: {}
  storage: {}
  logs: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
