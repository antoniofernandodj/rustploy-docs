---
title: Host Typesense with Rustploy
description: "Fast, fault-tolerant search engine built for real-time search in applications. Create Typesense in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Typesense**: Fast, fault-tolerant search engine built for real-time search in applications. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `typesense` |
| **Containers** | 1 (`typesense`) |
| **Images** | `typesense/typesense:29.0` |
| **UI port** | 8108, on service `typesense` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Typesense** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_key` | *random password, 16 characters* |
| `enable_cors` | true |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TYPESENSE_API_KEY` | ${api_key} |
| `TYPESENSE_ENABLE_CORS` | ${enable_cors} |

## Domains

| Service | Port | Host |
|---|---|---|
| `typesense` | 8108 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  typesense:
    image: typesense/typesense:29.0
    restart: unless-stopped
    environment:
      - TYPESENSE_API_KEY=${TYPESENSE_API_KEY}
      - TYPESENSE_ENABLE_CORS=${TYPESENSE_ENABLE_CORS}
      - TYPESENSE_DATA_DIR=/data
    volumes:
      - typesense-data:/data

volumes:
  typesense-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
