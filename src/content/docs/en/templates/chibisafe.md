---
title: Host Chibisafe with Rustploy
description: "High-performance personal file vault in the cloud. Create Chibisafe in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Chibisafe**: High-performance personal file vault in the cloud. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `chibisafe` |
| **Containers** | 3 (`chibisafe`, `chibisafe_server`, `caddy`) |
| **Images** | `chibisafe/chibisafe:latest`, `chibisafe/chibisafe-server:latest`, `caddy:2-alpine` |
| **UI port** | 80, on service `caddy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Chibisafe** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `caddy` | 80 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `./Caddyfile`

## The template docker-compose.yml

```yaml
# https://chibisafe.app/docs/intro
#
# Default Credentials
#   USERNAME: admin
#   PASSWORD: admin
services:
  chibisafe:
    image: chibisafe/chibisafe:latest
    networks:
      - chibinet
    environment:
      - BASE_API_URL=http://chibisafe_server:8000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "--quiet", "http://127.0.0.1:8001"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  chibisafe_server:
    image: chibisafe/chibisafe-server:latest
    networks:
      - chibinet
    volumes:
      - database:/app/database:rw
      - uploads:/app/uploads:rw
      - logs:/app/logs:rw
    restart: unless-stopped
    healthcheck:
      test:
        [
          "CMD",
          "wget",
          "--spider",
          "--quiet",
          "http://127.0.0.1:8000/api/health",
        ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  caddy:
    image: caddy:2-alpine
    networks:
      - chibinet
    volumes:
      - ../files/Caddyfile:/etc/caddy/Caddyfile:ro
      - uploads:/app/uploads:ro
    environment:
      - BASE_URL=":80"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "--quiet", "http://127.0.0.1:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

volumes:
  database:
  uploads:
  logs:

networks:
  chibinet:
    driver: bridge
    internal: true
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
