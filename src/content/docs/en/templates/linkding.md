---
title: Host Linkding with Rustploy
description: "Fast bookmark manager with a minimalist, distraction-free interface. Create Linkding in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Linkding**: Fast bookmark manager with a minimalist, distraction-free interface. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `linkding` |
| **Containers** | 1 (`linkding`) |
| **Images** | `sissbruecker/linkding:latest` |
| **UI port** | 9090, on service `linkding` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Linkding** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `superuser_password` | *random password, 32 characters* |
| `csrf_trusted_origins` | *domain (generated; replace it with yours)* |
| `db_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `LD_CONTEXT_PATH` |  |
| `LD_SUPERUSER_NAME` |  |
| `LD_SUPERUSER_PASSWORD` | ${superuser_password} |
| `LD_DISABLE_BACKGROUND_TASKS` | False |
| `LD_DISABLE_URL_VALIDATION` | False |
| `LD_ENABLE_AUTH_PROXY` | False |
| `LD_AUTH_PROXY_USERNAME_HEADER` |  |
| `LD_AUTH_PROXY_LOGOUT_URL` |  |
| `LD_CSRF_TRUSTED_ORIGINS` | ${csrf_trusted_origins} |
| `LD_DB_ENGINE` |  |
| `LD_DB_DATABASE` |  |
| `LD_DB_USER` |  |
| `LD_DB_PASSWORD` | ${db_password} |
| `LD_DB_HOST` |  |
| `LD_DB_PORT` |  |
| `LD_DB_OPTIONS` | {} |

## Domains

| Service | Port | Host |
|---|---|---|
| `linkding` | 9090 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  linkding:
    image: sissbruecker/linkding:latest
    restart: unless-stopped
    ports:
      - 9090
    volumes:
      - ../files/linkding-data:/etc/linkding/data
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
