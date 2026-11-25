---
title: Host BabyBuddy with Rustploy
description: "Routine tracker for baby care and development. Create BabyBuddy in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**BabyBuddy**: Routine tracker for baby care and development. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `babybuddy` |
| **Containers** | 1 (`babybuddy`) |
| **Images** | `linuxserver/babybuddy:2.7.0` |
| **UI port** | 8000, on service `babybuddy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **BabyBuddy** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password, 32 characters* |
| `time_zone` | America/New_York |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${main_domain} |
| `SECRET_KEY` | ${secret_key} |
| `TIME_ZONE` | ${time_zone} |

## Domains

| Service | Port | Host |
|---|---|---|
| `babybuddy` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  babybuddy:
    image: linuxserver/babybuddy:2.7.0
    restart: unless-stopped
    ports:
      - 8000
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
      - CSRF_TRUSTED_ORIGINS=https://${DOMAIN}
      - TIME_ZONE=${TIME_ZONE:-UTC}
      - SECRET_KEY=${SECRET_KEY}
    volumes:
      - config:/config

volumes:
  config: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
