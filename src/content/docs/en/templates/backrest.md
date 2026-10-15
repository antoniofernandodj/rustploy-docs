---
title: Host Backrest with Rustploy
description: "Web interface for managing and automating backups with restic. Create Backrest in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Backrest**: Web interface for managing and automating backups with restic. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `backrest` |
| **Containers** | 1 (`backrest`) |
| **Images** | `garethgeorge/backrest:v1.7.3` |
| **UI port** | 9898, on service `backrest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Backrest** and select it.
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
| `TZ` | Europe/Paris |

## Domains

| Service | Port | Host |
|---|---|---|
| `backrest` | 9898 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  backrest:
    image: garethgeorge/backrest:v1.7.3
    restart: unless-stopped
    ports:
      - 9898
    environment:
      - BACKREST_PORT=9898
      - BACKREST_DATA=/data # where it stores current state data
      - BACKREST_CONFIG=/config/config.json # where it stores backup configurations
      - XDG_CACHE_HOME=/cache # backup cache
      - TZ=${TZ}
    volumes:
      - backrest/data:/data
      - backrest/config:/config
      - backrest/config:/cache # to preserve backup cache between restarts
      - /:/userdata:ro # we mount /mnt/data to /userdata (that we want to backup)

volumes:
  backrest: 
  backrest-cache:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
