---
title: Host Appsmith with Rustploy
description: "Low-code builder for internal tools and admin panels. Create Appsmith in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Appsmith**: Low-code builder for internal tools and admin panels. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `appsmith` |
| **Containers** | 1 (`appsmith`) |
| **Images** | `appsmith/appsmith-ee:v1.94` |
| **UI port** | 80, on service `appsmith` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Appsmith** and select it.
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
| `appsmith` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  appsmith:
    image: appsmith/appsmith-ee:v1.94
    volumes:
      - appsmith-data:/appsmith-stacks
    restart: unless-stopped

volumes:
  appsmith-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
