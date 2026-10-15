---
title: Host KaraKeep with Rustploy
description: "Rebrand of the AI-powered bookmark and note app (formerly Hoarder). Create KaraKeep in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**KaraKeep**: Rebrand of the AI-powered bookmark and note app (formerly Hoarder). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `karakeep` |
| **Containers** | 3 (`web`, `chrome`, `meilisearch`) |
| **Images** | `ghcr.io/karakeep-app/karakeep:${KARAKEEP_VERSION:-release}`, `gcr.io/zenika-hub/alpine-chrome:124`, `getmeili/meilisearch:v1.13.3` |
| **UI port** | 3000, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **KaraKeep** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `karakeep_version` | release |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NEXTAUTH_URL` | http://${main_domain} |
| `MEILI_MASTER_KEY` | *random password, 36 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  web:
    image: ghcr.io/karakeep-app/karakeep:${KARAKEEP_VERSION:-release}
    restart: unless-stopped
    volumes:
      - data:/data
    environment:
      MEILI_ADDR: http://meilisearch:7700
      BROWSER_WEB_URL: http://chrome:9222
      DATA_DIR: /data
      NEXTAUTH_SECRET: your_secure_key
  chrome:
    image: gcr.io/zenika-hub/alpine-chrome:124
    restart: unless-stopped
    command:
      - --no-sandbox
      - --disable-gpu
      - --disable-dev-shm-usage
      - --remote-debugging-address=0.0.0.0
      - --remote-debugging-port=9222
      - --hide-scrollbars
  meilisearch:
    image: getmeili/meilisearch:v1.13.3
    restart: unless-stopped
    environment:
      MEILI_NO_ANALYTICS: "true"
    volumes:
      - meilisearch:/meili_data

volumes:
  meilisearch:
  data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
