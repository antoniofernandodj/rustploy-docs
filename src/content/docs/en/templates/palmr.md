---
title: Host Palmr with Rustploy
description: "Minimalist platform for sharing large files (WeTransfer alternative). Create Palmr in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Palmr**: Minimalist platform for sharing large files (WeTransfer alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `palmr` |
| **Containers** | 1 (`palmr`) |
| **Images** | `kyantech/palmr:latest` |
| **UI port** | 5487, on service `palmr` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Palmr** and select it.
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
| `ENCRYPTION_KEY` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `palmr` | 5487 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  palmr:
    image: kyantech/palmr:latest
    environment:
      - ENABLE_S3=false
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    ports:
      - "5487"
      - "3333"
    volumes:
      - palmr_data:/app/server
    restart: unless-stopped

volumes:
  palmr_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
