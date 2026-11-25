---
title: Host ArangoDB with Rustploy
description: "Native multi-model database (documents, graphs, key-value). Create ArangoDB in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ArangoDB**: Native multi-model database (documents, graphs, key-value). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `arangodb` |
| **Containers** | 1 (`arangodb`) |
| **Images** | `arangodb:3.12.4` |
| **UI port** | 8529, on service `arangodb` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ArangoDB** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `arango_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ARANGO_PASSWORD` | ${arango_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `arangodb` | 8529 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  arangodb:
    image: arangodb:3.12.4
    restart: unless-stopped
    ports:
      - 8529
    environment:
      - ARANGO_ROOT_PASSWORD=${ARANGO_PASSWORD}
    volumes:
      - data:/var/lib/arangodb3

volumes:
  data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
