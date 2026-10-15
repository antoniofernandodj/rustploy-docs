---
title: Host DumbAssets with Rustploy
description: "Static asset tracker that needs no database. Create DumbAssets in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**DumbAssets**: Static asset tracker that needs no database. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dumbassets` |
| **Containers** | 1 (`dumbassets`) |
| **Images** | `dumbwareio/dumbassets:latest` |
| **UI port** | 3000, on service `dumbassets` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **DumbAssets** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `default_pin` | *random password, 4 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NODE_ENV` | production |
| `DEBUG` | false |
| `SITE_TITLE` | DumbAssets |
| `BASE_URL` | https://${main_domain} |
| `DUMBASSETS_PIN` | ${default_pin} |
| `ALLOWED_ORIGINS` | * |
| `DEMO_MODE` | false |
| `APPRISE_URL` |  |
| `CURRENCY_CODE` | USD |
| `CURRENCY_LOCALE` | en-US |

## Domains

| Service | Port | Host |
|---|---|---|
| `dumbassets` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  dumbassets:
    image: dumbwareio/dumbassets:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbassets-data:/app/data

volumes:
  dumbassets-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
