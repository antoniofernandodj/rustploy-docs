---
title: Host MediaFetch with Rustploy
description: "Simplified web interface for downloading audio/video, powered by yt-dlp. Create MediaFetch in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**MediaFetch**: Simplified web interface for downloading audio/video, powered by yt-dlp. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mediafetch` |
| **Containers** | 1 (`mediafetch`) |
| **Images** | `lukedunsmoto/mediafetch:latest` |
| **UI port** | 3002, on service `mediafetch` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **MediaFetch** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `BASIC_AUTH_USER` | admin |
| `BASIC_AUTH_PASS` | *random password, 12 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `mediafetch` | 3002 |  |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/data/downloads`

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  mediafetch:
    image: lukedunsmoto/mediafetch:latest
    restart: unless-stopped
    expose:
      - "3002"
    volumes:
      - mediafetch_data:/data/downloads
    environment:
      - PORT=3002
      - BASIC_AUTH_USER=${BASIC_AUTH_USER}
      - BASIC_AUTH_PASS=${BASIC_AUTH_PASS}
      - PUBLIC_BASE_URL=https://${DOMAIN}
      - OUTPUT_DIR=/data/downloads

volumes:
  mediafetch_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
