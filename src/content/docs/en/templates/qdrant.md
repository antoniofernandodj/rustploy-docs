---
title: Host Qdrant with Rustploy
description: "Vector database focused on similarity search and high-performance embedding storage. Create Qdrant in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Qdrant**: Vector database focused on similarity search and high-performance embedding storage. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `qdrant` |
| **Containers** | 1 (`qdrant`) |
| **Images** | `qdrant/qdrant:latest` |
| **UI port** | 6333, on service `qdrant` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Qdrant** and select it.
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
| `QDRANT_API_KEY` | *random password, 32 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `qdrant` | 6333 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  qdrant:
    image: "qdrant/qdrant:latest"
    environment:
      - SERVICE_FQDN_QDRANT_6333
      - QDRANT__SERVICE__API_KEY=${QDRANT_API_KEY}
    expose:
      - "6333"
    volumes:
      - "qdrant_data:/qdrant/storage"
    healthcheck:
      test:
        - CMD-SHELL
        - bash -c ':> /dev/tcp/127.0.0.1/6333' || exit 1
      interval: 5s
      timeout: 5s
      retries: 3

volumes:
  qdrant_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
