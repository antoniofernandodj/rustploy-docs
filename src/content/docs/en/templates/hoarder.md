---
title: Host Hoarder with Rustploy
description: "Smart bookmark app with AI-based auto-tagging. Create Hoarder in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Hoarder**: Smart bookmark app with AI-based auto-tagging. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `hoarder` |
| **Containers** | 3 (`web`, `chrome`, `meilisearch`) |
| **Images** | `ghcr.io/hoarder-app/hoarder:0.22.0`, `gcr.io/zenika-hub/alpine-chrome:124`, `getmeili/meilisearch:v1.6` |
| **UI port** | 3000, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Hoarder** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `next_secret` | *random base64 key (32 bytes)* |
| `meili_master_key` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NEXTAUTH_SECRET` | ${next_secret} |
| `MEILI_MASTER_KEY` | ${meili_master_key} |
| `NEXTAUTH_URL` | http://${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `web` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  web:
    image: ghcr.io/hoarder-app/hoarder:0.22.0
    restart: unless-stopped
    volumes:
      - hoarder-data:/data
    ports:
      - 3000
    environment:
      - DISABLE_SIGNUPS
      - NEXTAUTH_URL
      - NEXTAUTH_SECRET
      - MEILI_ADDR=http://meilisearch:7700
      - BROWSER_WEB_URL=http://chrome:9222
      - DATA_DIR=/data
      - MEILI_MASTER_KEY
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
    image: getmeili/meilisearch:v1.6
    restart: unless-stopped
    environment:
      - MEILI_MASTER_KEY
      - MEILI_NO_ANALYTICS=true
    volumes:
      - meilisearch-data:/meili_data
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://127.0.0.1:7700/health'
      interval: 2s
      timeout: 10s
      retries: 15
volumes:
  meilisearch-data:
  hoarder-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
