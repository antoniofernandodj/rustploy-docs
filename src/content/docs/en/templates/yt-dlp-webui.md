---
title: Host yt-dlp-webui with Rustploy
description: "Simple web GUI that maps the options of the yt-dlp terminal utility. Create yt-dlp-webui in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**yt-dlp-webui**: Simple web GUI that maps the options of the yt-dlp terminal utility. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `yt-dlp-webui` |
| **Containers** | 1 (`yt-dlp-webui`) |
| **Images** | `marcobaobao/yt-dlp-webui` |
| **UI port** | 3033, on service `yt-dlp-webui` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **yt-dlp-webui** and select it.
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
| `yt-dlp-webui` | 3033 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  yt-dlp-webui:
    image: marcobaobao/yt-dlp-webui
    ports:
      - 3033
    volumes:
      - downloads:/downloads
      - config:/config
    healthcheck:
      test: curl -f http://localhost:3033 || exit 1
    restart: unless-stopped

volumes:
  downloads: {}
  config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
