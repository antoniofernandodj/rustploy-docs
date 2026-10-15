---
title: Host Plark with Rustploy
description: "Fast, self-hosted visual builder for corporate websites. Create Plark in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Plark**: Fast, self-hosted visual builder for corporate websites. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `plark` |
| **Containers** | 1 (`plark`) |
| **Images** | `plarkinc/plark:latest` |
| **UI port** | 80, on service `plark` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Plark** and select it.
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
| `plark` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  plark:
    image: plarkinc/plark:latest
    pull_policy: always
    restart: unless-stopped
    ports:
      - "80"
    volumes:
      - plark-data:/var/data
volumes:
  plark-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
