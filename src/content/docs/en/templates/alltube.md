---
title: Host AllTube with Rustploy
description: "Web GUI for downloading videos with youtube-dl. Create AllTube in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AllTube**: Web GUI for downloading videos with youtube-dl. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `alltube` |
| **Containers** | 1 (`alltube`) |
| **Images** | `dnomd343/alltube:latest` |
| **UI port** | 80, on service `alltube` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AllTube** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `title` | My AllTube Site |
| `convert` | true |
| `stream` | true |
| `remux` | true |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TITLE` | ${title} |
| `CONVERT` | ${convert} |
| `STREAM` | ${stream} |
| `REMUX` | ${remux} |

## Domains

| Service | Port | Host |
|---|---|---|
| `alltube` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  alltube:
    image: dnomd343/alltube:latest
    restart: unless-stopped
    ports:
      - 80
    environment:
      - TITLE=${TITLE}
      - CONVERT=${CONVERT}
      - STREAM=${STREAM}
      - REMUX=${REMUX}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
