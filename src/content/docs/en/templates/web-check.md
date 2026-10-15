---
title: Host Web-Check with Rustploy
description: "All-in-one web analyzer that gathers infrastructure, DNS and security data about any domain. Create Web-Check in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Web-Check**: All-in-one web analyzer that gathers infrastructure, DNS and security data about any domain. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `web-check` |
| **Containers** | 1 (`web-check`) |
| **Images** | `lissy93/web-check` |
| **UI port** | 3000, on service `web-check` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Web-Check** and select it.
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
| `GOOGLE_CLOUD_API_KEY` |  |
| `TORRENT_IP_API_KEY` |  |
| `SECURITY_TRAILS_API_KEY` |  |
| `BUILT_WITH_API_KEY` |  |
| `URL_SCAN_API_KEY` |  |
| `TRANCO_USERNAME` |  |
| `TRANCO_API_KEY` |  |
| `CLOUDMERSIVE_API_KEY` |  |
| `REACT_APP_SHODAN_API_KEY` |  |
| `REACT_APP_WHO_API_KEY` |  |
| `PORT` | 3000 |
| `DISABLE_GUI` | false |
| `API_TIMEOUT_LIMIT` | 10000 |
| `API_CORS_ORIGIN` | * |
| `API_ENABLE_RATE_LIMIT` | true |
| `ENABLE_ANALYTICS` | false |

## Domains

| Service | Port | Host |
|---|---|---|
| `web-check` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.9'
services:
  web-check:
    image: lissy93/web-check
    ports:
      - 3000
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
