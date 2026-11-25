---
title: Host Omni-Tools with Rustploy
description: "Toolbox of utilities grouped into a single, stable web panel. Create Omni-Tools in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Omni-Tools**: Toolbox of utilities grouped into a single, stable web panel. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `omni-tools` |
| **Containers** | 1 (`omni-tools`) |
| **Images** | `iib0011/omni-tools:latest` |
| **UI port** | 80, on service `omni-tools` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Omni-Tools** and select it.
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
| `LOCIZE_API_KEY` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `omni-tools` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  omni-tools:
    image: iib0011/omni-tools:latest
    restart: unless-stopped
    ports:
      - 80
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
