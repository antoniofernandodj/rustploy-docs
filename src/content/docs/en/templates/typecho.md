---
title: Host Typecho with Rustploy
description: "Lightweight, minimalist and fast PHP CMS for publishing simple blogs. Create Typecho in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Typecho**: Lightweight, minimalist and fast PHP CMS for publishing simple blogs. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `typecho` |
| **Containers** | 2 (`typecho`, `db`) |
| **Images** | `80x86/typecho:latest`, `mysql:5.7` |
| **UI port** | 80, on service `typecho` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Typecho** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 16 characters* |
| `root_password` | *random password, 16 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `typecho` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  typecho:
    image: 80x86/typecho:latest
    restart: unless-stopped
    environment:
      PHP_TZ: Asia/Shanghai
      PHP_MAX_EXECUTION_TIME: 600
    volumes:
      - typecho_data:/data
    depends_on:
      - db

  db:
    image: mysql:5.7
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: typecho
      MYSQL_USER: typecho
      MYSQL_PASSWORD: typecho_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - db_data:/var/lib/mysql

volumes:
  typecho_data:
  db_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
