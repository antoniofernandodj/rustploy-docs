---
title: Host Calibre with Rustploy
description: "Complete e-book library manager and organizer. Create Calibre in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Calibre**: Complete e-book library manager and organizer. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `calibre` |
| **Containers** | 1 (`calibre`) |
| **Images** | `linuxserver/calibre:7.26.0` |
| **UI port** | 8080, on service `calibre` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Calibre** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PASSWORD` | *random password* |

## Domains

| Service | Port | Host |
|---|---|---|
| `calibre` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: '3.8'

services:
  calibre:
    image: linuxserver/calibre:7.26.0
    restart: unless-stopped
    environment:
      - PASSWORD=${PASSWORD}
      - TZ=Etc/UTC
      - PUID=1000
      - PGID=1000
    ports:
      - 8080
    volumes:
      - books:/books
      - data:/config

volumes:
  books:
  data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
