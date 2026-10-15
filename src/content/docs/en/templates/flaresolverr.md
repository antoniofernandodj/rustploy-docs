---
title: Host FlareSolverr with Rustploy
description: "Proxy to bypass Cloudflare and DDoS-GUARD protections. Create FlareSolverr in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**FlareSolverr**: Proxy to bypass Cloudflare and DDoS-GUARD protections. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `flaresolverr` |
| **Containers** | 1 (`flaresolverr`) |
| **Images** | `ghcr.io/flaresolverr/flaresolverr:latest` |
| **UI port** | 8191, on service `flaresolverr` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **FlareSolverr** and select it.
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
| `LOG_LEVEL` | info |
| `LOG_HTML` | false |
| `CAPTCHA_SOLVER` | none |
| `TZ` | Europe/London |

## Domains

| Service | Port | Host |
|---|---|---|
| `flaresolverr` | 8191 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  flaresolverr:
    image: ghcr.io/flaresolverr/flaresolverr:latest
    ports:
      - 8191
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
