---
title: Host SearXNG with Rustploy
description: "Private metasearch engine that aggregates Google/Bing results without tracking data. Create SearXNG in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**SearXNG**: Private metasearch engine that aggregates Google/Bing results without tracking data. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `searxng` |
| **Containers** | 2 (`valkey`, `searxng`) |
| **Images** | `valkey/valkey:8-alpine`, `searxng/searxng:latest` |
| **UI port** | 8080, on service `searxng` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **SearXNG** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password, 64 characters* |

## Domains

| Service | Port | Host |
|---|---|---|
| `searxng` | 8080 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/searxng/settings.yml`

## The template docker-compose.yml

```yaml
services:
  valkey:
    image: valkey/valkey:8-alpine
    command: valkey-server --save 30 1 --loglevel warning
    restart: unless-stopped
    volumes:
      - valkey-data:/data

  searxng:
    image: searxng/searxng:latest
    restart: unless-stopped
    volumes:
      - ../files/searxng:/etc/searxng
      - searxng-data:/var/cache/searxng

volumes:
  valkey-data: {}
  searxng-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
