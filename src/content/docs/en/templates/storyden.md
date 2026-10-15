---
title: Host Storyden with Rustploy
description: "Modern forum and structured discussion board platform for engaged communities. Create Storyden in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Storyden**: Modern forum and structured discussion board platform for engaged communities. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `storyden` |
| **Containers** | 1 (`storyden`) |
| **Images** | `ghcr.io/southclaws/storyden:latest` |
| **UI port** | 8000, on service `storyden` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Storyden** and select it.
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
| `STORYDEN_FQDN` | http://${main_domain} |

## Domains

| Service | Port | Host |
|---|---|---|
| `storyden` | 8000 | ${main_domain} |

## The template docker-compose.yml

```yaml
volumes:
  storyden_data:

services:
  storyden:
    image: ghcr.io/southclaws/storyden:latest
    expose:
      - 8000
    volumes:
      - storyden_data:/storyden/data
    environment:
      # https://www.storyden.org/docs/operation/configuration#core-configuration
      PUBLIC_WEB_ADDRESS: ${STORYDEN_FQDN}
      PUBLIC_API_ADDRESS: ${STORYDEN_FQDN}

      # https://www.storyden.org/docs/operation/configuration#email
      # EMAIL_PROVIDER: ${EMAIL_PROVIDER}
      # SENDGRID_FROM_NAME: ${SENDGRID_FROM_NAME}
      # SENDGRID_FROM_ADDRESS: ${SENDGRID_FROM_ADDRESS}
      # SENDGRID_API_KEY: ${SENDGRID_API_KEY}

      # https://www.storyden.org/docs/operation/configuration#authentication
      # JWT_SECRET: ${JWT_SECRET}
      # OAUTH_GOOGLE_ENABLED: ${OAUTH_GOOGLE_ENABLED}
      # OAUTH_GOOGLE_CLIENT_ID: ${OAUTH_GOOGLE_CLIENT_ID}
      # OAUTH_GOOGLE_CLIENT_SECRET: ${OAUTH_GOOGLE_CLIENT_SECRET}
      # OAUTH_GITHUB_ENABLED: ${OAUTH_GITHUB_ENABLED}
      # OAUTH_GITHUB_CLIENT_ID: ${OAUTH_GITHUB_CLIENT_ID}
      # OAUTH_GITHUB_CLIENT_SECRET: ${OAUTH_GITHUB_CLIENT_SECRET}
      # OAUTH_DISCORD_ENABLED: ${OAUTH_DISCORD_ENABLED}
      # OAUTH_DISCORD_CLIENT_ID: ${OAUTH_DISCORD_CLIENT_ID}
      # OAUTH_DISCORD_CLIENT_SECRET: ${OAUTH_DISCORD_CLIENT_SECRET}
      # OAUTH_KEYCLOAK_ENABLED: ${OAUTH_KEYCLOAK_ENABLED}
      # OAUTH_KEYCLOAK_CLIENT_ID: ${OAUTH_KEYCLOAK_CLIENT_ID}
      # OAUTH_KEYCLOAK_CLIENT_SECRET: ${OAUTH_KEYCLOAK_CLIENT_SECRET}
      # OAUTH_KEYCLOAK_ISSUER_URL: ${OAUTH_KEYCLOAK_ISSUER_URL}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
