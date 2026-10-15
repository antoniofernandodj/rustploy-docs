---
title: Host Docling Serve with Rustploy
description: "API service for AI-based document conversion. Create Docling Serve in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Docling Serve**: API service for AI-based document conversion. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `docling-serve` |
| **Containers** | 1 (`docling-serve`) |
| **Images** | `quay.io/docling-project/docling-serve:latest` |
| **UI port** | 5001, on service `docling-serve` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Docling Serve** and select it.
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
| `DOCLING_SERVE_ENABLE_UI` | 1 |
| `DOCLING_SERVE_HOST` | 0.0.0.0 |
| `DOCLING_SERVE_PORT` | 5001 |

## Domains

| Service | Port | Host |
|---|---|---|
| `docling-serve` | 5001 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  docling-serve:
    image: quay.io/docling-project/docling-serve:latest
    restart: unless-stopped
    ports:
      - 5001
    environment:
      - DOCLING_SERVE_ENABLE_UI=1
      - DOCLING_SERVE_HOST=0.0.0.0
      - DOCLING_SERVE_PORT=5001
    volumes:
      - docling-data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  docling-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
