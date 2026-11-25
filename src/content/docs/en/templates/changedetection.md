---
title: Host Change Detection with Rustploy
description: "Smart monitor that detects changes in web pages. Create Change Detection in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Change Detection**: Smart monitor that detects changes in web pages. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `changedetection` |
| **Containers** | 1 (`changedetection`) |
| **Images** | `ghcr.io/dgtlmoon/changedetection.io:0.49` |
| **UI port** | 5000, on service `changedetection` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Change Detection** and select it.
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
| `changedetection` | 5000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io:0.49
    restart: unless-stopped
    ports:
      - 5000
    volumes:
      - datastore:/datastore

volumes:
  datastore:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
