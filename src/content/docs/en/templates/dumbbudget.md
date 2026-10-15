---
title: Host DumbBudget with Rustploy
description: "Minimalist PIN-protected finance tracker (no database). Create DumbBudget in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**DumbBudget**: Minimalist PIN-protected finance tracker (no database). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dumbbudget` |
| **Containers** | 1 (`dumbbudget`) |
| **Images** | `dumbwareio/dumbbudget:latest` |
| **UI port** | 3000, on service `dumbbudget` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **DumbBudget** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `dumbbudget_pin` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DUMBBUDGET_PIN` | ${dumbbudget_pin} |
| `BASE_URL` | ${main_domain} |
| `CURRENCY` | USD |
| `SITE_TITLE` | DumbBudget |
| `INSTANCE_NAME` |  |
| `ALLOWED_ORIGINS` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `dumbbudget` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  dumbbudget:
    image: dumbwareio/dumbbudget:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbbudget-data:/app/data

volumes:
  dumbbudget-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
