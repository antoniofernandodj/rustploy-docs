---
title: Host Flatnotes (TOTP) with Rustploy
description: "Flatnotes with a two-factor authentication (2FA) layer. Create Flatnotes (TOTP) in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Flatnotes (TOTP)**: Flatnotes with a two-factor authentication (2FA) layer. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `flatnotes-totp` |
| **Containers** | 1 (`flatnotes`) |
| **Images** | `dullage/flatnotes:latest` |
| **UI port** | 8080, on service `flatnotes` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Flatnotes (TOTP)** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `username` | *generated username* |
| `password` | *random password, 16 characters* |
| `secret_key` | *random password, 32 characters* |
| `totp_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PUID` | 1000 |
| `PGID` | 1000 |
| `FLATNOTES_AUTH_TYPE` | totp |
| `FLATNOTES_USERNAME` | *generated username* |
| `FLATNOTES_PASSWORD` | *random password* |
| `FLATNOTES_SECRET_KEY` | ${secret_key} |
| `FLATNOTES_TOTP_KEY` | ${totp_key} |
| `FLATNOTES_SESSION_EXPIRY_DAYS` | 30 |
| `FLATNOTES_PATH_PREFIX` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `flatnotes` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  flatnotes:
    image: dullage/flatnotes:latest
    restart: unless-stopped
    environment:
      PUID: ${PUID}
      PGID: ${PGID}
      FLATNOTES_AUTH_TYPE: "totp"
      FLATNOTES_USERNAME: ${FLATNOTES_USERNAME}
      FLATNOTES_PASSWORD: ${FLATNOTES_PASSWORD}
      FLATNOTES_SECRET_KEY: ${FLATNOTES_SECRET_KEY}
      FLATNOTES_TOTP_KEY: ${FLATNOTES_TOTP_KEY}
      FLATNOTES_SESSION_EXPIRY_DAYS: ${FLATNOTES_SESSION_EXPIRY_DAYS}
      FLATNOTES_PATH_PREFIX: ${FLATNOTES_PATH_PREFIX}
    expose:
      - 8080
    volumes:
      - flatnotes-data:/data

volumes:
  flatnotes-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
