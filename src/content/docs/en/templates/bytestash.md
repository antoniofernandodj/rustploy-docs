---
title: Host ByteStash with Rustploy
description: "Private code snippet repository and organizer. Create ByteStash in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**ByteStash**: Private code snippet repository and organizer. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bytestash` |
| **Containers** | 1 (`bytestash`) |
| **Images** | `ghcr.io/jordan-dalby/bytestash:1.5.6` |
| **UI port** | 5000, on service `bytestash` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **ByteStash** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `jwt_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | *generated JWT* |

## Domains

| Service | Port | Host |
|---|---|---|
| `bytestash` | 5000 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  bytestash:
    image: ghcr.io/jordan-dalby/bytestash:1.5.6
    restart: unless-stopped
    ports:
      - "5000"
    environment:
      - BASE_PATH=
      - JWT_SECRET=${JWT_SECRET}
      - TOKEN_EXPIRY=24h
      - ALLOW_NEW_ACCOUNTS=true
      - DEBUG=true
      - DISABLE_ACCOUNTS=false
      - DISABLE_INTERNAL_ACCOUNTS=false
      - OIDC_ENABLED=false
      - OIDC_DISPLAY_NAME=
      - OIDC_ISSUER_URL=
      - OIDC_CLIENT_ID=
      - OIDC_CLIENT_SECRET=
      - OIDC_SCOPES=
    volumes:
      - snippets:/data/snippets

volumes:
  snippets:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
