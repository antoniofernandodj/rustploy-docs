---
title: Host Collabora Office with Rustploy
description: "Powerful online office suite based on LibreOffice. Create Collabora Office in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Collabora Office**: Powerful online office suite based on LibreOffice. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `collabora-office` |
| **Containers** | 1 (`collabora`) |
| **Images** | `collabora/code:latest` |
| **UI port** | 9980, on service `collabora` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Collabora Office** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `DOMAIN` | *domain (generated; replace it with yours)* |
| `USERNAME` | user |
| `PASSWORD` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${DOMAIN} |
| `USERNAME` | ${USERNAME} |
| `PASSWORD` | ${PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `collabora` | 9980 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  collabora:
    image: collabora/code:latest
    ports:
      - "9980"
    environment:
      - domain=${DOMAIN}
      - username=${USERNAME}
      - password=${PASSWORD}
      - extra_params=--o:ssl.enable=false
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
