---
title: Host DumbPad with Rustploy
description: "Simple password-protected web notepad. Create DumbPad in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**DumbPad**: Simple password-protected web notepad. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dumbpad` |
| **Containers** | 1 (`dumbpad`) |
| **Images** | `dumbwareio/dumbpad:latest` |
| **UI port** | 3000, on service `dumbpad` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **DumbPad** and select it.
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
| `NODE_ENV` | production |
| `SITE_TITLE` | DumbPad |
| `BASE_URL` | https://${main_domain} |
| `DUMBPAD_PIN` |  |
| `LOCKOUT_TIME` | 15 |
| `MAX_ATTEMPTS` | 5 |
| `COOKIE_MAX_AGE` | 24 |
| `PAGE_HISTORY_COOKIE_AGE` | 365 |

## Domains

| Service | Port | Host |
|---|---|---|
| `dumbpad` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  dumbpad:
    image: dumbwareio/dumbpad:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbpad-data:/app/data

volumes:
  dumbpad-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
