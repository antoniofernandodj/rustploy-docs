---
title: Host n8n with Rustploy
description: "Advanced low-code platform for task automation and complex integration flows. Create n8n in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**n8n**: Advanced low-code platform for task automation and complex integration flows. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `n8n` |
| **Containers** | 1 (`n8n`) |
| **Images** | `docker.n8n.io/n8nio/n8n:1.104.0` |
| **UI port** | 5678, on service `n8n` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **n8n** and select it.
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
| `N8N_HOST` | ${main_domain} |
| `N8N_PORT` | 5678 |
| `GENERIC_TIMEZONE` | Europe/Berlin |

## Domains

| Service | Port | Host |
|---|---|---|
| `n8n` | 5678 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:1.104.0
    restart: always
    environment:
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=${N8N_PORT}
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=https://${N8N_HOST}/
      - GENERIC_TIMEZONE=${GENERIC_TIMEZONE}
      - N8N_SECURE_COOKIE=false
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
