---
title: Host Dashy with Rustploy
description: "Customizable personal dashboard with status monitoring and widgets. Create Dashy in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Dashy**: Customizable personal dashboard with status monitoring and widgets. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dashy` |
| **Containers** | 1 (`dashy`) |
| **Images** | `lissy93/dashy:latest` |
| **UI port** | 8080, on service `dashy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Dashy** and select it.
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
| `dashy` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  dashy:
    image: lissy93/dashy:latest
    restart: unless-stopped
    ports:
      - 8080
    volumes:
      - dashy-config:/app/user-data
volumes:
  dashy-config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
