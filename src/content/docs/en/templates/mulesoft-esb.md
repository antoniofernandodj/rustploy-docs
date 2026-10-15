---
title: Host Mulesoft Esb with Rustploy
description: "Mulesoft Esb application. Create Mulesoft Esb in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mulesoft Esb**: Mulesoft Esb application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mulesoft-esb` |
| **Containers** | 1 (`mule`) |
| **Images** | `yogeshmulecraft/mulece-esb:latest` |
| **UI port** | 8081, on service `mule` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mulesoft Esb** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `timezone` | UTC |
| `mule_version` | 4.9.0 |
| `http_port` | 8081 |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `MULE_VERSION` | ${mule_version} |
| `HTTP_PORT` | ${http_port} |
| `MULE_HOME` | /opt/mule-standalone |
| `MULE_BASE` | /opt/mule-standalone |
| `TZ` | ${timezone} |
| `MULE_VERBOSE_EXCEPTIONS` | true |

## Domains

| Service | Port | Host |
|---|---|---|
| `mule` | 8081 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  mule:
    image: yogeshmulecraft/mulece-esb:latest
    restart: unless-stopped
    ports:
      - "8081"
    environment:
      - MULE_VERSION=${MULE_VERSION:-4.9.0}
      - HTTP_PORT=${HTTP_PORT:-8081}
      - MULE_HOME=/opt/mule-standalone
      - MULE_BASE=/opt/mule-standalone
      - TZ=UTC
      - MULE_VERBOSE_EXCEPTIONS=true
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:${HTTP_PORT:-8081}/ || exit 0"]
      interval: 60s
      timeout: 20s
      retries: 5
      start_period: 120s
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
