---
title: Host Anubis with Rustploy
description: "Protects websites by blocking malicious bots. Create Anubis in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Anubis**: Protects websites by blocking malicious bots. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `anubis` |
| **Containers** | 1 (`anubis`) |
| **Images** | `ghcr.io/techarohq/anubis:latest` |
| **UI port** | 8923, on service `anubis` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Anubis** and select it.
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
| `COOKIE_DOMAIN` | ${main_domain} |
| `TARGET` | YOURLOCALHOST:PORT |
| `DIFFICULTY` | 5 |
| `OG_PASSTHROUGH` | true |
| `OG_EXPIRY_TIME` | 1h |
| `OG_CACHE_CONSIDER_HOST` | true |
| `SERVE_ROBOTS_TXT` | false |
| `mounts` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `anubis` | 8923 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  anubis:
    image: ghcr.io/techarohq/anubis:latest
    restart: unless-stopped
    ports:
      - "8923" # Anubis default port
    environment:
      # Required: Point to your frontend service locally
      # Example: http://mydocker-wyeud:8080
      - TARGET=${TARGET}

      # Bind address
      - BIND=:8923

      # Cookie domain (set to your domain)
      - COOKIE_DOMAIN=${COOKIE_DOMAIN}

      # Challenge difficulty (1-20, default is 5)
      # Lower = easier for users, Higher = harder for bots
      - DIFFICULTY=${DIFFICULTY}

      # OpenGraph passthrough (allows social media previews to work)
      - OG_PASSTHROUGH=${OG_PASSTHROUGH}
      - OG_EXPIRY_TIME=${OG_EXPIRY_TIME}
      - OG_CACHE_CONSIDER_HOST=${OG_CACHE_CONSIDER_HOST}

      # Optional: Serve robots.txt to discourage indexing
      - SERVE_ROBOTS_TXT=${SERVE_ROBOTS_TXT} # Set to true if you don't want search engines


# Unconmment in case you want to connect the anubis container to dokploy-network
#     networks:
#       - dokploy-network

# networks:
#   dokploy-network:
#     external: true # Using existing dokploy-network to connect to your frontend locally
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
