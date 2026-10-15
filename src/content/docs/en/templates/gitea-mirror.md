---
title: Host Gitea Mirror with Rustploy
description: "Automatic synchronizer of GitHub repositories to Gitea instances. Create Gitea Mirror in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Gitea Mirror**: Automatic synchronizer of GitHub repositories to Gitea instances. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `gitea-mirror` |
| **Containers** | 1 (`gitea-mirror`) |
| **Images** | `ghcr.io/raylabshq/gitea-mirror:latest` |
| **UI port** | 4321, on service `gitea-mirror` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Gitea Mirror** and select it.
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
| `BETTER_AUTH_SECRET` | *random base64 key (64 bytes)* |
| `BETTER_AUTH_URL` | https://${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `gitea-mirror` | 4321 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  gitea-mirror:
    image: ghcr.io/raylabshq/gitea-mirror:latest
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=3", "--spider", "http://localhost:4321/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 15s
    environment:
      # Absolutely required - cannot be changed via UI
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
      # Core settings with defaults
      - NODE_ENV=production
      - DATABASE_URL=file:data/gitea-mirror.db
      - HOST=0.0.0.0
      - PORT=4321
    volumes:
      - gitea_mirror_data:/app/data

volumes:
  gitea_mirror_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
