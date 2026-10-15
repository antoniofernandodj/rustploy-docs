---
title: Host Lobe Chat with Rustploy
description: "Modern, modular AI chat framework with voice plugin support. Create Lobe Chat in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Lobe Chat**: Modern, modular AI chat framework with voice plugin support. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `lobe-chat` |
| **Containers** | 1 (`lobe-chat`) |
| **Images** | `lobehub/lobe-chat:v1.26.1` |
| **UI port** | 3210, on service `lobe-chat` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Lobe Chat** and select it.
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
| `lobe-chat` | 3210 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  lobe-chat:
    image: lobehub/lobe-chat:v1.26.1
    restart: always
    ports:
      - 3210
    environment:
      OPENAI_API_KEY: sk-xxxx
      OPENAI_PROXY_URL: https://api-proxy.com/v1
      ACCESS_CODE: lobe66
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
