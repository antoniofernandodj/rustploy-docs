---
title: Host Memos with Rustploy
description: "Quick-notes hub inspired by Twitter, with a focus on privacy. Create Memos in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Memos**: Quick-notes hub inspired by Twitter, with a focus on privacy. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `memos` |
| **Containers** | 1 (`memos`) |
| **Images** | `neosmemo/memos:stable` |
| **UI port** | 5230, on service `memos` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Memos** and select it.
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
| `MEMOS_MODE` | prod |
| `MEMOS_PORT` | 5230 |

## Domains

| Service | Port | Host |
|---|---|---|
| `memos` | 5230 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  memos:
    image: neosmemo/memos:stable
    restart: unless-stopped
    volumes:
      - memos_data:/var/opt/memos
    environment:
      - MEMOS_MODE=${MEMOS_MODE}
      - MEMOS_PORT=${MEMOS_PORT}
    ports:
      - "5230"
volumes:
  memos_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
