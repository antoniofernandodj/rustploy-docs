---
title: Host Openinary with Rustploy
description: "Open-source alternative to Cloudinary for dynamic media processing. Create Openinary in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Openinary**: Open-source alternative to Cloudinary for dynamic media processing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `openinary` |
| **Containers** | 1 (`openinary`) |
| **Images** | `openinary/openinary:${IMAGE_TAG:-latest}` |
| **UI port** | 3000, on service `openinary` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Openinary** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `image_tag` | latest |
| `better_auth_secret` | *random password, 64 characters* |
| `better_auth_url` | http://${main_domain} |
| `allowed_origin` | http://${main_domain} |
| `next_public_api_base_url` | /api |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `IMAGE_TAG` | ${image_tag} |
| `BETTER_AUTH_SECRET` | ${better_auth_secret} |
| `BETTER_AUTH_URL` | ${better_auth_url} |
| `ALLOWED_ORIGIN` | ${allowed_origin} |
| `NEXT_PUBLIC_API_BASE_URL` | ${next_public_api_base_url} |

## Domains

| Service | Port | Host |
|---|---|---|
| `openinary` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  openinary:
    image: openinary/openinary:${IMAGE_TAG:-latest}
    pull_policy: always
    restart: unless-stopped
    expose:
      - 3000
    environment:
      NODE_ENV: production
      MODE: fullstack
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:-/api}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      ALLOWED_ORIGIN: ${ALLOWED_ORIGIN:-http://${domain}}
      DOCKER_CONTAINER: "true"
    volumes:
      - cache-data:/app/apps/api/cache
      - public-files:/app/apps/api/public
      - db-data:/app/data
      - db-data:/app/web-standalone/data

volumes:
  cache-data:
  public-files:
  db-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
