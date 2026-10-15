---
title: Host Checkcle with Rustploy
description: "Enterprise security tool for runtime auditing and compliance. Create Checkcle in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Checkcle**: Enterprise security tool for runtime auditing and compliance. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `checkcle` |
| **Containers** | 1 (`checkcle`) |
| **Images** | `operacle/checkcle:latest` |
| **UI port** | 8090, on service `checkcle` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Checkcle** and select it.
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
| `checkcle` | 8090 | ${main_domain} |

## The template docker-compose.yml

```yaml
#Default id pass Username: admin@example.com Password: Admin123456

version: "3.9"
services:
  checkcle:
    image: operacle/checkcle:latest
    restart: unless-stopped
    expose:
      - 8090
    volumes:
      - checkcle-data:/mnt/pb_data
    ulimits:
      nofile:
        soft: 4096
        hard: 8192

volumes:
  checkcle-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
