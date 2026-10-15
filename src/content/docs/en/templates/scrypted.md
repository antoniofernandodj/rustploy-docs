---
title: Host Scrypted with Rustploy
description: "Security video processing hub with very high frame rates and NVR integration. Create Scrypted in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Scrypted**: Security video processing hub with very high frame rates and NVR integration. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `scrypted` |
| **Containers** | 1 (`scrypted`) |
| **Images** | `ghcr.io/koush/scrypted:latest` |
| **UI port** | 11080, on service `scrypted` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Scrypted** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION` | ${SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION} |
| `SCRYPTED_WEBHOOK_UPDATE` | http://${main_domain}:10444/v1/update |

## Domains

| Service | Port | Host |
|---|---|---|
| `scrypted` | 11080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  scrypted:
    image: ghcr.io/koush/scrypted:latest
    environment:
      - SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION=${SCRYPTED_WEBHOOK_UPDATE_AUTHORIZATION}
      - SCRYPTED_WEBHOOK_UPDATE=http://${main_domain}:10444/v1/update
    volumes:
      - ../files/scrypted-volume:/server/volume
      # Optional NVR volume, uncomment if needed
      # - ../files/nvr:/nvr
    restart: unless-stopped
    logging:
      driver: "none"
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
