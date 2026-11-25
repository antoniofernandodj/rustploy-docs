---
title: Host Actual Budget with Rustploy
description: "Fast, private personal finance manager. Create Actual Budget in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Actual Budget**: Fast, private personal finance manager. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `actualbudget` |
| **Containers** | 1 (`actualbudget`) |
| **Images** | `docker.io/actualbudget/actual-server:latest` |
| **UI port** | 5006, on service `actualbudget` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Actual Budget** and select it.
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
| `actualbudget` | 5006 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  actualbudget:
    image: docker.io/actualbudget/actual-server:latest
    environment:
      # See all options at https://actualbudget.org/docs/config
      - ACTUAL_PORT=5006
    volumes:
      - actual-data:/data
    restart: unless-stopped

volumes:
  actual-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
