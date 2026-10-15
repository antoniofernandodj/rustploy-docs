---
title: Host CyberChef with Rustploy
description: "Web Swiss Army knife for encryption, encoding and data analysis. Create CyberChef in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**CyberChef**: Web Swiss Army knife for encryption, encoding and data analysis. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cyberchef` |
| **Containers** | 1 (`cyberchef`) |
| **Images** | `ghcr.io/gchq/cyberchef:latest` |
| **UI port** | 80, on service `cyberchef` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **CyberChef** and select it.
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
| `cyberchef` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  cyberchef:
    image: ghcr.io/gchq/cyberchef:latest
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
