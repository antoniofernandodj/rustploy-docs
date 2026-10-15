---
title: Host Beszel with Rustploy
description: "Lightweight server monitor with container stats and alerts. Create Beszel in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Beszel**: Lightweight server monitor with container stats and alerts. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `beszel` |
| **Containers** | 1 (`beszel`) |
| **Images** | `henrygd/beszel:0.10.2` |
| **UI port** | 8090, on service `beszel` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Beszel** and select it.
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
| `beszel` | 8090 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  beszel:
    image: henrygd/beszel:0.10.2
    restart: unless-stopped
    ports:
      - 8090
    volumes:
      - beszel_data:/beszel_data
      - /var/run/docker.sock:/var/run/docker.sock:ro

volumes:
  beszel_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
