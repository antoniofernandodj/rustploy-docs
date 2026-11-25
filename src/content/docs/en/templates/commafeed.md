---
title: Host CommaFeed with Rustploy
description: "Minimalist RSS feed aggregator running on PostgreSQL. Create CommaFeed in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**CommaFeed**: Minimalist RSS feed aggregator running on PostgreSQL. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `commafeed` |
| **Containers** | 1 (`commafeed`) |
| **Images** | `athou/commafeed:latest-h2` |
| **UI port** | 8082, on service `commafeed` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **CommaFeed** and select it.
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
| `commafeed` | 8082 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  commafeed:
    image: athou/commafeed:latest-h2
    restart: unless-stopped
    volumes:
      - ../files/commafeed-data:/commafeed/data
    ports:
      - 8082
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
