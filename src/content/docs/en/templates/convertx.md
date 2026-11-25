---
title: Host ConvertX with Rustploy
description: "Utility service for bulk media file conversion. Create ConvertX in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ConvertX**: Utility service for bulk media file conversion. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `convertx` |
| **Containers** | 1 (`convertx`) |
| **Images** | `ghcr.io/c4illin/convertx` |
| **UI port** | 3000, on service `convertx` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ConvertX** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *generated JWT* |
| `account_registration` | false |
| `http_allowed` | true |
| `allow_unauthenticated` | false |
| `auto_delete_every_n_hours` | 24 |
| `webroot` |  |
| `ffmpeg_args` |  |
| `hide_history` | false |
| `language` | en |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | *generated JWT* |
| `ACCOUNT_REGISTRATION` | ${account_registration} |
| `HTTP_ALLOWED` | ${http_allowed} |
| `ALLOW_UNAUTHENTICATED` | ${allow_unauthenticated} |
| `AUTO_DELETE_EVERY_N_HOURS` | ${auto_delete_every_n_hours} |
| `WEBROOT` | ${webroot} |
| `FFMPEG_ARGS` | ${ffmpeg_args} |
| `HIDE_HISTORY` | ${hide_history} |
| `LANGUAGE` | ${language} |

## Domains

| Service | Port | Host |
|---|---|---|
| `convertx` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  convertx:
    image: ghcr.io/c4illin/convertx
    restart: unless-stopped
    ports:
      - 3000
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - ACCOUNT_REGISTRATION=${ACCOUNT_REGISTRATION}
      - HTTP_ALLOWED=${HTTP_ALLOWED}
      - ALLOW_UNAUTHENTICATED=${ALLOW_UNAUTHENTICATED}
      - AUTO_DELETE_EVERY_N_HOURS=${AUTO_DELETE_EVERY_N_HOURS}
      - WEBROOT=${WEBROOT}
      - FFMPEG_ARGS=${FFMPEG_ARGS}
      - HIDE_HISTORY=${HIDE_HISTORY}
      - LANGUAGE=${LANGUAGE}
    volumes:
      - ../files/data:/app/data
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
