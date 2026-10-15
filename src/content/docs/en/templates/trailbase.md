---
title: Host TrailBase with Rustploy
description: "Fast application server in Rust and SQLite with a native WebAssembly runtime. Create TrailBase in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**TrailBase**: Fast application server in Rust and SQLite with a native WebAssembly runtime. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `trailbase` |
| **Containers** | 1 (`trailbase`) |
| **Images** | `trailbase/trailbase:latest` |
| **UI port** | 4000, on service `trailbase` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **TrailBase** and select it.
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
| `trailbase` | 4000 | ${main_domain} |

## The template docker-compose.yml

```yaml
# IMPORTANT: The initial admin credentials will be printed in the logs after the container starts
# Access TrailBase Admin UI at: https://your-domain.com/_/admin (replace with your configured domain)

version: "3.8"

services:
  trailbase:
    image: trailbase/trailbase:latest
    restart: unless-stopped
    volumes:
      - trailbase-data:/app/traildepot
      # If you want to use a local directory instead, uncomment the line below and specify the path to your local
      # directory. Make sure this directory is writable by the trailbase user (UID 1000) and the group (GID 1000) i.e.
      # chown -R 1000:1000 /path/to/your/local/directory
      # - /path/to/your/local/directory:/app/traildepot
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:4000/api/healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  # comment the line below if you specified a local directory in the volumes section of the trailbase service
  trailbase-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
