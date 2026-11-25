---
title: Host Easy!Appointments with Rustploy
description: "Web system for customer bookings and appointments. Create Easy!Appointments in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Easy!Appointments**: Web system for customer bookings and appointments. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `easyappointments` |
| **Containers** | 2 (`easyappointments`, `mysql`) |
| **Images** | `alextselegidis/easyappointments:1.5.0`, `mysql:8.0` |
| **UI port** | 80, on service `easyappointments` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Easy!Appointments** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${main_domain} |
| `DB_PASSWORD` | ${db_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `easyappointments` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  easyappointments:
    image: alextselegidis/easyappointments:1.5.0
    restart: unless-stopped
    environment:
      - BASE_URL=http://${DOMAIN}
      - DB_HOST=mysql
      - DB_NAME=easyappointments
      - DB_USERNAME=root
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - easyappointments:/var/www/html
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
      - MYSQL_DATABASE=easyappointments
    volumes:
      - mysql:/var/lib/mysql

volumes:
  easyappointments:
  mysql:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
