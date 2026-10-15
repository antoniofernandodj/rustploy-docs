---
title: Host Letterfeed with Rustploy
description: "Smart converter that turns emailed newsletters into RSS feeds. Create Letterfeed in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Letterfeed**: Smart converter that turns emailed newsletters into RSS feeds. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `letterfeed` |
| **Containers** | 2 (`backend`, `frontend`) |
| **Images** | `ghcr.io/leonmuscoden/letterfeed-backend:latest`, `ghcr.io/leonmuscoden/letterfeed-frontend:latest` |
| **UI port** | 3000, on service `frontend` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Letterfeed** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password, 64 characters* |
| `auth_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LETTERFEED_APP_BASE_URL` | https://${main_domain} |
| `LETTERFEED_BACKEND_URL` | http://backend:8000 |
| `LETTERFEED_DATABASE_URL` | sqlite:////data/letterfeed.db |
| `LETTERFEED_IMAP_SERVER` |  |
| `LETTERFEED_IMAP_USERNAME` |  |
| `LETTERFEED_IMAP_PASSWORD` |  |
| `LETTERFEED_SEARCH_FOLDER` | INBOX |
| `LETTERFEED_MOVE_TO_FOLDER` |  |
| `LETTERFEED_MARK_AS_READ` | true |
| `LETTERFEED_EMAIL_CHECK_INTERVAL` | 15 |
| `LETTERFEED_AUTO_ADD_NEW_SENDERS` | false |
| `LETTERFEED_SECRET_KEY` | ${secret_key} |
| `LETTERFEED_AUTH_USERNAME` | admin |
| `LETTERFEED_AUTH_PASSWORD` | ${auth_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `frontend` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.9"

services:
  backend:
    image: ghcr.io/leonmuscoden/letterfeed-backend:latest
    restart: unless-stopped
    environment:
      LETTERFEED_APP_BASE_URL: ${LETTERFEED_APP_BASE_URL}
      LETTERFEED_BACKEND_URL: ${LETTERFEED_BACKEND_URL}
      LETTERFEED_DATABASE_URL: ${LETTERFEED_DATABASE_URL}
      LETTERFEED_IMAP_SERVER: ${LETTERFEED_IMAP_SERVER}
      LETTERFEED_IMAP_USERNAME: ${LETTERFEED_IMAP_USERNAME}
      LETTERFEED_IMAP_PASSWORD: ${LETTERFEED_IMAP_PASSWORD}
      LETTERFEED_SEARCH_FOLDER: ${LETTERFEED_SEARCH_FOLDER}
      LETTERFEED_MOVE_TO_FOLDER: ${LETTERFEED_MOVE_TO_FOLDER}
      LETTERFEED_MARK_AS_READ: ${LETTERFEED_MARK_AS_READ}
      LETTERFEED_EMAIL_CHECK_INTERVAL: ${LETTERFEED_EMAIL_CHECK_INTERVAL}
      LETTERFEED_AUTO_ADD_NEW_SENDERS: ${LETTERFEED_AUTO_ADD_NEW_SENDERS}
      LETTERFEED_SECRET_KEY: ${LETTERFEED_SECRET_KEY}
      LETTERFEED_AUTH_USERNAME: ${LETTERFEED_AUTH_USERNAME}
      LETTERFEED_AUTH_PASSWORD: ${LETTERFEED_AUTH_PASSWORD}
    volumes:
      - letterfeed_data:/data

  frontend:
    image: ghcr.io/leonmuscoden/letterfeed-frontend:latest
    restart: unless-stopped
    environment:
      LETTERFEED_APP_BASE_URL: ${LETTERFEED_APP_BASE_URL}
      LETTERFEED_BACKEND_URL: ${LETTERFEED_BACKEND_URL}
    expose:
      - 3000
    depends_on:
      - backend

volumes:
  letterfeed_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
