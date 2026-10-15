---
title: Host Glpi with Rustploy
description: "Glpi application. Create Glpi in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Glpi**: Glpi application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `glpi` |
| **Containers** | 2 (`glpi-mysql`, `glpi-web`) |
| **Images** | `mysql:9.1.0`, `elestio/glpi:10.0.16` |
| **UI port** | 80, on service `glpi-web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Glpi** and select it.
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
| `glpi-web` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  glpi-mysql:
    image: mysql:9.1.0
    restart: always
    volumes:
      - glpi-mysql-data:/var/lib/mysql


  glpi-web:
    image: elestio/glpi:10.0.16
    restart: always
    volumes:
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
      - glpi-www-data:/var/www/html/glpi
    environment:
      - TIMEZONE=Europe/Brussels


volumes:
  glpi-mysql-data:
  glpi-www-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
