---
title: Host Vaultwarden with Rustploy
description: "Lightweight Rust implementation compatible with the whole Bitwarden app suite. Create Vaultwarden in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Vaultwarden**: Lightweight Rust implementation compatible with the whole Bitwarden app suite. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `vaultwarden` |
| **Containers** | 1 (`vaultwarden`) |
| **Images** | `vaultwarden/server:1.34.3` |
| **UI port** | 80, on service `vaultwarden` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Vaultwarden** and select it.
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
| `SIGNUPS_ALLOWED` | true |
| `DOMAIN` | https://${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `vaultwarden` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
# the webserver can take a while to start up, so don't be alarmed if it takes a few minutes to get a response
services:
  vaultwarden:
    image: vaultwarden/server:1.34.3
    restart: always
    environment:
      DOMAIN: ${DOMAIN}
      SIGNUPS_ALLOWED: ${SIGNUPS_ALLOWED}
    volumes:
      - vaultwarden:/data
    expose:
      - 80

volumes:
  vaultwarden:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
