---
title: Host Gitea (SQLite) with Rustploy
description: "Simplified Gitea running in a single container with SQLite. Create Gitea (SQLite) in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Gitea (SQLite)**: Simplified Gitea running in a single container with SQLite. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `gitea-sqlite` |
| **Containers** | 1 (`gitea`) |
| **Images** | `docker.gitea.com/gitea:1.24.4` |
| **UI port** | 3000, on service `gitea` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Gitea (SQLite)** and select it.
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
| `USER_UID` | 1000 |
| `USER_GID` | 1000 |

## Domains

| Service | Port | Host |
|---|---|---|
| `gitea` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  gitea:
    image: docker.gitea.com/gitea:1.24.4
    restart: unless-stopped
    environment:
      - USER_UID=1000
      - USER_GID=1000
      # SQLite (default) lives at /data/gitea
      # Example optional overrides (set in template.toml env or UI):
      # - GITEA__mailer__ENABLED=true
    volumes:
      - gitea-data:/data
    expose:
      - "3000" # Web UI
      - "22" # SSH (internal only)
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/"]
      interval: 15s
      timeout: 5s
      retries: 10

volumes:
  gitea-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
