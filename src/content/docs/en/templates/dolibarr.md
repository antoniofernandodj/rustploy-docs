---
title: Host Dolibarr with Rustploy
description: "Unified ERP and CRM software package for business management. Create Dolibarr in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Dolibarr**: Unified ERP and CRM software package for business management. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dolibarr` |
| **Containers** | 2 (`dolibarr`, `db`) |
| **Images** | `dolibarr/dolibarr:21.0.0`, `mariadb:10.11` |
| **UI port** | 80, on service `dolibarr` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Dolibarr** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_name` | dolibarr |
| `db_user` | dolibarr |
| `db_password` | *random password, 32 characters* |
| `db_root_password` | *random password, 32 characters* |
| `admin_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOLIBARR_HOST` | ${main_domain} |
| `DB_NAME` | ${db_name} |
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_ROOT_PASSWORD` | ${db_root_password} |
| `ADMIN_PASSWORD` | ${admin_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `dolibarr` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  dolibarr:
    image: dolibarr/dolibarr:21.0.0
    restart: always
    environment:
      DOLI_DB_HOST: db
      DOLI_DB_NAME: $DB_NAME
      DOLI_DB_USER: $DB_USER
      DOLI_DB_PASSWORD: $DB_PASSWORD
      DOLI_URL_ROOT: ${DOLIBARR_HOST}
      DOLI_ADMIN_LOGIN: admin
      DOLI_ADMIN_PASSWORD: $ADMIN_PASSWORD
    volumes:
      - dolibarr_documents:/var/www/documents
      - dolibarr_html:/var/www/html
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mariadb:10.11
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: $DB_ROOT_PASSWORD
      MYSQL_DATABASE: $DB_NAME
      MYSQL_USER: $DB_USER
      MYSQL_PASSWORD: $DB_PASSWORD
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "healthcheck.sh --connect --innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

volumes:
  dolibarr_documents:
  dolibarr_html:
  db_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
