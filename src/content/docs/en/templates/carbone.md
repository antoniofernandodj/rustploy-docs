---
title: Host Carbone with Rustploy
description: "High-performance engine that generates documents from JSON data. Create Carbone in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Carbone**: High-performance engine that generates documents from JSON data. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `carbone` |
| **Containers** | 1 (`carbone`) |
| **Images** | `carbone/carbone-ee:full-4.25.5` |
| **UI port** | 4000, on service `carbone` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Carbone** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `carbone_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CARBONE_KEY` | ${carbone_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `carbone` | 4000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  carbone:
    image: carbone/carbone-ee:full-4.25.5
    restart: unless-stopped
    environment:
      - CARBONE_EE_LICENSE=${CARBONE_KEY}
      - CARBONE_EE_STUDIO=true
    ports:
      - 4000
    volumes:
      - template:/app/template

volumes:
  template:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
