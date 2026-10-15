---
title: Host Ampache with Rustploy
description: "Streaming and management hub for music and video. Create Ampache in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ampache**: Streaming and management hub for music and video. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ampache` |
| **Containers** | 1 (`ampache`) |
| **Images** | `ampache/ampache:latest` |
| **UI port** | 80, on service `ampache` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ampache** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `media_path` | /path/to/your/media |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MEDIA_PATH` | ${media_path} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ampache` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  ampache:
    image: ampache/ampache:latest
    restart: unless-stopped
    ports:
      - 80
    volumes:
      - config:/var/www/config
      - log:/var/log/ampache
      - mysql:/var/lib/mysql
      - ${MEDIA_PATH}:/media

volumes:
  config: {}
  log: {}
  mysql: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
