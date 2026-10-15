---
title: Host Grimoire with Rustploy
description: "Ultra-fast bookmark organizer and saver. Create Grimoire in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Grimoire**: Ultra-fast bookmark organizer and saver. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `grimoire` |
| **Containers** | 1 (`grimoire`) |
| **Images** | `goniszewski/grimoire:latest` |
| **UI port** | 5173, on service `grimoire` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Grimoire** and select it.
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
| `PORT` | 5173 |
| `PUBLIC_ORIGIN` | https://${main_domain} |
| `PUBLIC_HTTPS_ONLY` | true |
| `PUBLIC_SIGNUP_DISABLED` | false |

## Domains

| Service | Port | Host |
|---|---|---|
| `grimoire` | 5173 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  grimoire:
    image: goniszewski/grimoire:latest
    restart: unless-stopped
    volumes:
      - grimoire_data:/app/data
    ports:
      - "5173"
volumes:
  grimoire_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
