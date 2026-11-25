---
title: Host StreamFlow with Rustploy
description: "Platform for relaying real-time video streams (restreaming) to multiple channels (YouTube/Facebook). Create StreamFlow in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**StreamFlow**: Platform for relaying real-time video streams (restreaming) to multiple channels (YouTube/Facebook). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `streamflow` |
| **Containers** | 1 (`streamflow`) |
| **UI port** | 7575, on service `streamflow` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **StreamFlow** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `session_secret` | *random password, 64 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SESSION_SECRET` | ${session_secret} |
| `TIMEZONE` | Asia/Jakarta |

## Domains

| Service | Port | Host |
|---|---|---|
| `streamflow` | 7575 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  streamflow:
    build:
      context: https://github.com/bangtutorial/streamflow.git
    restart: unless-stopped
    environment:
      - PORT=7575
      - SESSION_SECRET=${SESSION_SECRET}
      - NODE_ENV=production
      - TZ=${TIMEZONE}
    volumes:
      - streamflow-db:/app/db
      - streamflow-logs:/app/logs
      - streamflow-uploads:/app/public/uploads
    ports:
      - 7575

volumes:
  streamflow-db: {}
  streamflow-logs: {}
  streamflow-uploads: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
