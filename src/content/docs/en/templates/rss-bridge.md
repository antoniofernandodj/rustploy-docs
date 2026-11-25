---
title: Host RSS-Bridge with Rustploy
description: "PHP utility that generates structured RSS feeds for platforms that lack them. Create RSS-Bridge in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**RSS-Bridge**: PHP utility that generates structured RSS feeds for platforms that lack them. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rss-bridge` |
| **Containers** | 1 (`rss-bridge`) |
| **Images** | `rssbridge/rss-bridge:latest` |
| **UI port** | 80, on service `rss-bridge` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **RSS-Bridge** and select it.
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
| `rss-bridge` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  rss-bridge:
    image: rssbridge/rss-bridge:latest
    restart: unless-stopped
    expose:
      - 80
    volumes:
      - rssbridge-config:/config

volumes:
  rssbridge-config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
