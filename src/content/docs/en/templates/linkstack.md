---
title: Host LinkStack with Rustploy
description: "Highly customizable \"Link in Bio\" platform to aggregate social networks. Create LinkStack in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**LinkStack**: Highly customizable "Link in Bio" platform to aggregate social networks. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `linkstack` |
| **Containers** | 2 (`linkstack`, `mysql`) |
| **Images** | `linkstackorg/linkstack:latest`, `mysql:8` |
| **UI port** | 80, on service `linkstack` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **LinkStack** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_email` | *generated email* |
| `mysql_root_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TZ` | Europe/Berlin |
| `SERVER_ADMIN` | ${admin_email} |
| `HTTP_SERVER_NAME` | ${main_domain} |
| `HTTPS_SERVER_NAME` | ${main_domain} |
| `LOG_LEVEL` | info |
| `PHP_MEMORY_LIMIT` | 256M |
| `UPLOAD_MAX_FILESIZE` | 8M |
| `MYSQL_ROOT_PASSWORD` | ${mysql_root_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `linkstack` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  linkstack:
    image: linkstackorg/linkstack:latest
    environment:
      TZ: "Europe/Berlin"
      SERVER_ADMIN: "${admin_email}"
      HTTP_SERVER_NAME: "${main_domain}"
      HTTPS_SERVER_NAME: "${main_domain}"
      LOG_LEVEL: "info"
      PHP_MEMORY_LIMIT: "256M"
      UPLOAD_MAX_FILESIZE: "8M"
    volumes:
      - linkstack-data:/htdocs
    restart: unless-stopped
    depends_on:
      - mysql

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: ${mysql_root_password}
    volumes:
      - mysql-data:/var/lib/mysql
    restart: unless-stopped

volumes:
  linkstack-data: {}
  mysql-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
