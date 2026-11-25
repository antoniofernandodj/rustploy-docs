---
title: Host Statping-NG with Rustploy
description: "Visual uptime and page health monitor with elegant status dashboards. Create Statping-NG in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Statping-NG**: Visual uptime and page health monitor with elegant status dashboards. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `statping-ng` |
| **Containers** | 1 (`statping-ng`) |
| **Images** | `adamboutcher/statping-ng:latest` |
| **UI port** | 8080, on service `statping-ng` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Statping-NG** and select it.
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
| `TZ` | UTC |
| `DB_CONN` | sqlite |

## Domains

| Service | Port | Host |
|---|---|---|
| `statping-ng` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  statping-ng:
    image: adamboutcher/statping-ng:latest
    restart: unless-stopped
    environment:
      - TZ=${TZ}
      - DB_CONN=sqlite
    volumes:
      - ../files/statping-ng:/app
    ports:
      - 8080
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
