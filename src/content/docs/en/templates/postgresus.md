---
title: Host Postgresus with Rustploy
description: "Utility for continuous automation and scheduling of PostgreSQL database backups. Create Postgresus in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Postgresus**: Utility for continuous automation and scheduling of PostgreSQL database backups. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `postgresus` |
| **Containers** | 1 (`postgresus`) |
| **Images** | `rostislavdugin/postgresus:latest` |
| **UI port** | 4005, on service `postgresus` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Postgresus** and select it.
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
| `postgresus` | 4005 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgresus:
    image: rostislavdugin/postgresus:latest
    ports:
      - "4005"
    volumes:
      # Persistent data storage
      - postgresus-data:/postgresus-data
    restart: unless-stopped
    environment:
      # Optional: Set timezone
      - TZ=UTC
    healthcheck:
      test: [ "CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:4005" ]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgresus-data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
