---
title: Host Barrage with Rustploy
description: "Minimalist, mobile-first web interface for the Deluge torrent client. Create Barrage in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Barrage**: Minimalist, mobile-first web interface for the Deluge torrent client. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `barrage` |
| **Containers** | 1 (`barrage`) |
| **Images** | `maulik9898/barrage:0.3.0` |
| **UI port** | 3000, on service `barrage` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Barrage** and select it.
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
| `NEXTAUTH_SECRET` | ${base64} |
| `NEXTAUTH_URL` | http://${main_domain} |
| `DELUGE_URL` | http://your-deluge-ip:8112 |
| `DELUGE_PASSWORD` | *random password, 16 characters* |
| `BARRAGE_PASSWORD` | *random password, 16 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `barrage` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  barrage:
    image: maulik9898/barrage:0.3.0
    restart: unless-stopped
    ports:
      - 3000
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://${DOMAIN}
      - DELUGE_URL=${DELUGE_URL}
      - DELUGE_PASSWORD=${DELUGE_PASSWORD}
      - BARRAGE_PASSWORD=${BARRAGE_PASSWORD}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
