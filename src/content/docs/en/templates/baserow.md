---
title: Host Baserow with Rustploy
description: "Relational database with a spreadsheet interface (Airtable alternative). Create Baserow in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Baserow**: Relational database with a spreadsheet interface (Airtable alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `baserow` |
| **Containers** | 1 (`baserow`) |
| **Images** | `baserow/baserow:1.25.2` |
| **UI port** | 80, on service `baserow` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Baserow** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BASEROW_HOST` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `baserow` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  baserow:
    image: baserow/baserow:1.25.2
    environment:
      BASEROW_PUBLIC_URL: "http://${BASEROW_HOST}"
    volumes:
      - baserow_data:/baserow/data
volumes:
  baserow_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
