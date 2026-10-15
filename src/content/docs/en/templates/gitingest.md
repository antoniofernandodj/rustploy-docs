---
title: Host Gitingest with Rustploy
description: "Utility app integrated with S3, Sentry and Prometheus metrics collection. Create Gitingest in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Gitingest**: Utility app integrated with S3, Sentry and Prometheus metrics collection. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `gitingest` |
| **Containers** | 1 (`gitingest`) |
| **Images** | `elestio/gitingest:${SOFTWARE_VERSION_TAG}` |
| **UI port** | 8000, on service `gitingest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Gitingest** and select it.
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
| `SOFTWARE_VERSION_TAG` | latest |
| `ALLOWED_HOSTS` | ${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `gitingest` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  gitingest:
    image: elestio/gitingest:${SOFTWARE_VERSION_TAG}
    restart: unless-stopped
    expose:
      - 8000
    environment:
      - ALLOWED_HOSTS=${ALLOWED_HOSTS}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
