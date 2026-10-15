---
title: Host Qbitwebui with Rustploy
description: "Qbitwebui application. Create Qbitwebui in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Qbitwebui**: Qbitwebui application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `qbitwebui` |
| **Containers** | 1 (`qbitwebui`) |
| **Images** | `ghcr.io/maciejonos/qbitwebui:latest` |
| **UI port** | 3000, on service `qbitwebui` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Qbitwebui** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `encryption_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ENCRYPTION_KEY` | ${encryption_key} |
| `PORT` | 3000 |
| `DATABASE_PATH` | /data/qbitwebui.db |
| `SALT_PATH` | /data/.salt |

## Domains

| Service | Port | Host |
|---|---|---|
| `qbitwebui` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  qbitwebui:
    image: ghcr.io/maciejonos/qbitwebui:latest
    restart: unless-stopped
    environment:
      # Required: Encryption key for storing credentials (min 32 chars)
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      # Optional: Server port (default: 3000)
      - PORT=${PORT:-3000}
      # Optional: Database location (default: ./data/qbitwebui.db)
      - DATABASE_PATH=${DATABASE_PATH:-/data/qbitwebui.db}
      # Optional: Salt file location (default: ./data/.salt)
      - SALT_PATH=${SALT_PATH:-/data/.salt}
      # Optional: Allow self-signed certificates for qBittorrent instances (default: false)
      # - ALLOW_SELF_SIGNED_CERTS=${ALLOW_SELF_SIGNED_CERTS:-false}
      # Optional: Disable authentication/login (single-user mode) (default: false)
      # - DISABLE_AUTH=${DISABLE_AUTH:-false}
      # Optional: Disable new registrations, creates default admin account (default: false)
      # - DISABLE_REGISTRATION=${DISABLE_REGISTRATION:-false}
      # Optional: Enable file browser by setting downloads path
      # - DOWNLOADS_PATH=/downloads
    volumes:
      - qbitwebui_data:/data
      # Optional: Mount downloads directory for file browser feature
      # Read-only mount (browse & download only):
      # - /path/to/your/downloads:/downloads:ro
      # Or read-write mount (enables delete/move/copy/rename):
      # - /path/to/your/downloads:/downloads
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s

volumes:
  qbitwebui_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
