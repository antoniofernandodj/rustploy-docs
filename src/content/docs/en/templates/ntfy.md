---
title: Host NTFY with Rustploy
description: "Utility service that sends push notifications to phones or desktops via simple HTTP requests. Create NTFY in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**NTFY**: Utility service that sends push notifications to phones or desktops via simple HTTP requests. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ntfy` |
| **Containers** | 1 (`ntfy`) |
| **Images** | `binwiederhier/ntfy` |
| **UI port** | 80, on service `ntfy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **NTFY** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `ntfy_domain` | *domain (generated; replace it with yours)* |
| `ntfy_http_port` | 80 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `HTTP_PORT` | ${ntfy_http_port} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ntfy` | 80 | ${ntfy_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/templates/myapp.yml`
- `/server.yml`

## The template docker-compose.yml

```yaml
services:
  ntfy:
    image: binwiederhier/ntfy
    restart: unless-stopped
    command:
      - serve
    ports:
      - "${HTTP_PORT}"
    volumes:
      - ntfy-data:/var/lib/ntfy
      - ntfy-cache:/var/cache/ntfy
      - ../files/server.yml:/etc/ntfy/server.yml:ro
      - ../files/templates:/etc/ntfy/templates:ro
    healthcheck:
      test: ["CMD-SHELL", "wget -q --tries=1 http://localhost:${HTTP_PORT}/v1/health -O - | grep -Eo '\"healthy\"\\s*:\\s*true' || exit 1"]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  ntfy-data:
  ntfy-cache:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
