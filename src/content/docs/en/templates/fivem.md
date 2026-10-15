---
title: Host Fivem with Rustploy
description: "Fivem application. Create Fivem in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Fivem**: Fivem application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `fivem` |
| **Containers** | 1 (`fivem`) |
| **Images** | `spritsail/fivem:latest` |
| **UI port** | 40120, on service `fivem` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Fivem** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `license_key` | *random password, 32 characters* |
| `rcon_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LICENSE_KEY` | ${license_key} |
| `RCON_PASSWORD` | ${rcon_password} |
| `NO_DEFAULT_CONFIG` | ${NO_DEFAULT_CONFIG:-} |

## Domains

| Service | Port | Host |
|---|---|---|
| `fivem` | 40120 | ${main_domain} |

## The template docker-compose.yml

```yaml
# docker-compose.yml
# 
# IMPORTANT: FiveM Template - Two Deployment Modes
# 
# MODE 1: Standard FiveM Server
# - Set LICENSE_KEY environment variable (get free from https://forum.fivem.net/)
# - Leave NO_DEFAULT_CONFIG empty or unset
# - Server configured via /config files
# - No web management interface
#
# MODE 2: txAdmin Web Interface  
# - Set NO_DEFAULT_CONFIG=1
# - DO NOT set LICENSE_KEY (configure via web UI)
# - Access web management at https://your-domain
# - License configured through txAdmin interface
#
# WARNING: Don't mix modes! Setting both LICENSE_KEY and NO_DEFAULT_CONFIG=1 causes errors
#
services:
  fivem:
    image: spritsail/fivem:latest
    restart: unless-stopped
    tty: true
    stdin_open: true
    environment:
      - LICENSE_KEY=${license_key}
      - RCON_PASSWORD=${rcon_password}
      - NO_DEFAULT_CONFIG=${NO_DEFAULT_CONFIG:-}
    volumes:
      - fivem_config:/config
      - fivem_txdata:/txData
    ports:
      - 30120:30120
      - 30120:30120/udp
      - 40120
    labels:
      - "traefik.enable=true"

volumes:
  fivem_config:
  fivem_txdata:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
