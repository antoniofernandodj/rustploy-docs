---
title: Host Enshrouded with Rustploy
description: "Dedicated server for the multiplayer game Enshrouded via Steam. Create Enshrouded in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Enshrouded**: Dedicated server for the multiplayer game Enshrouded via Steam. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `enshrouded` |
| **Containers** | 1 (`enshrouded`) |
| **Images** | `mornedhels/enshrouded-server:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Enshrouded** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `SERVER_NAME` | Enshrouded Dokploy |
| `SERVER_PASSWORD` | *random password, 15 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SERVER_NAME` | ${SERVER_NAME} |
| `SERVER_PASSWORD` | ${SERVER_PASSWORD} |

## The template docker-compose.yml

```yaml
services:
  enshrouded:
    image: mornedhels/enshrouded-server:latest
    container_name: enshrouded
    hostname: enshrouded
    restart: unless-stopped
    stop_grace_period: 90s
    ports:
      - "15637:15637/udp"
      - "27015:27015/udp"
    volumes:
      - enshrouded-persistent-data:/opt/enshrouded
    # only add ntsync device if your kernel supports it (6.14 or newer)
    # devices:
    #   - /dev/ntsync:/dev/ntsync
    environment:
      - SERVER_NAME=${SERVER_NAME}
      - SERVER_PASSWORD=${SERVER_PASSWORD}
      - SERVER_SLOT_COUNT=6
      - UPDATE_CRON=0 3 * * *
      - PUID=4711
      - PGID=4711

volumes:
  enshrouded-persistent-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
