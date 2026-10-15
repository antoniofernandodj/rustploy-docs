---
title: Host BentoPDF with Rustploy
description: "Lightweight microservice that generates PDF files via an HTTP API. Create BentoPDF in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**BentoPDF**: Lightweight microservice that generates PDF files via an HTTP API. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bentopdf` |
| **Containers** | 1 (`bentopdf`) |
| **Images** | `bentopdf/bentopdf:latest` |
| **UI port** | 80, on service `bentopdf` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **BentoPDF** and select it.
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
| `bentopdf` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  bentopdf:
    image: bentopdf/bentopdf:latest
    restart: unless-stopped
    expose:
      - 80
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
