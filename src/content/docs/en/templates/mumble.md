---
title: Host Mumble with Rustploy
description: "Ultra-low-latency voice communication server for cooperative gaming. Create Mumble in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mumble**: Ultra-low-latency voice communication server for cooperative gaming. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mumble` |
| **Containers** | 1 (`mumble-server`) |
| **Images** | `mumblevoip/mumble-server:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mumble** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `superuser_password` | *random password, 32 characters* |
| `welcome_text` | Welcome to Mumble Server! Low-latency voice chat. |
| `max_users` | 50 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SUPERUSER_PASSWORD` | ${superuser_password} |
| `WELCOME_TEXT` | ${welcome_text} |
| `MAX_USERS` | ${max_users} |

## The template docker-compose.yml

```yaml
services:
  mumble-server:
    image: mumblevoip/mumble-server:latest
    restart: unless-stopped
    ports:
      - 64738
      - 64738/udp
    volumes:
      - mumble-data:/data
    environment:
      - MUMBLE_SUPERUSER_PASSWORD=${SUPERUSER_PASSWORD}
      - MUMBLE_CONFIG_WELCOMETEXT=${WELCOME_TEXT}
      - MUMBLE_CONFIG_USERS=${MAX_USERS}

volumes:
  mumble-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
