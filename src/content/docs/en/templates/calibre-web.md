---
title: Host Calibre-Web with Rustploy
description: "Modern interface to read and browse Calibre e-books in the browser. Create Calibre-Web in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Calibre-Web**: Modern interface to read and browse Calibre e-books in the browser. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `calibre-web` |
| **Containers** | 1 (`calibre-web`) |
| **Images** | `lscr.io/linuxserver/calibre-web:latest` |
| **UI port** | 8083, on service `calibre-web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Calibre-Web** and select it.
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
| `PUID` | 1000 |
| `PGID` | 1000 |
| `TZ` | Etc/UTC |
| `DOCKER_MODS` | linuxserver/mods:universal-calibre |
| `OAUTHLIB_RELAX_TOKEN_SCOPE` | 1 |

## Domains

| Service | Port | Host |
|---|---|---|
| `calibre-web` | 8083 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `startup-scripts/metadata-db-generator.sh`

## The template docker-compose.yml

```yaml
services:
  calibre-web:
    image: lscr.io/linuxserver/calibre-web:latest
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      # - DOCKER_MODS=linuxserver/mods:universal-calibre # optional
      - OAUTHLIB_RELAX_TOKEN_SCOPE=1 # optional
    volumes:
      - calibre-config:/config
      - calibre-books:/books
      - ../files/startup-scripts:/custom-cont-init.d:ro # optional, comment out if you have your own metadata.db file, otherwise it will be created

volumes:
  calibre-config: {}
  calibre-books: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
