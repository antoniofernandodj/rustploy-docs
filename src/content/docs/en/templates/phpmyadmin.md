---
title: Host Phpmyadmin with Rustploy
description: "The classic, friendly web manager for MySQL and MariaDB databases. Create Phpmyadmin in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Phpmyadmin**: The classic, friendly web manager for MySQL and MariaDB databases. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `phpmyadmin` |
| **Containers** | 2 (`db`, `phpmyadmin`) |
| **Images** | `mysql:5.7`, `phpmyadmin/phpmyadmin:5.2.1` |
| **UI port** | 80, on service `phpmyadmin` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Phpmyadmin** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `root_password` | *random password, 32 characters* |
| `user_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MYSQL_ROOT_PASSWORD` | ${root_password} |
| `MYSQL_DATABASE` | mysql |
| `MYSQL_USER` | phpmyadmin |
| `MYSQL_PASSWORD` | ${user_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `phpmyadmin` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: tu_base_de_datos
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql


  phpmyadmin:
    image: phpmyadmin/phpmyadmin:5.2.1
    environment:
      PMA_HOST: db
      PMA_USER: ${MYSQL_USER}
      PMA_PASSWORD: ${MYSQL_PASSWORD}
      PMA_ARBITRARY: 1
    depends_on:
      - db

volumes:
  db_data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
