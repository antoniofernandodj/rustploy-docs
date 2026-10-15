---
title: Host Gotenberg with Rustploy
description: "Scalable stateless API in Docker dedicated to converting files to PDF. Create Gotenberg in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Gotenberg**: Scalable stateless API in Docker dedicated to converting files to PDF. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `gotenberg` |
| **Containers** | 1 (`gotenberg`) |
| **Images** | `gotenberg/gotenberg:latest` |
| **UI port** | 3000, on service `gotenberg` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Gotenberg** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `username` | gotenberg |
| `password` | changethis |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `GOTENBERG_API_BASIC_AUTH_USERNAME` | *generated username* |
| `GOTENBERG_API_BASIC_AUTH_PASSWORD` | *random password* |

## Domains

| Service | Port | Host |
|---|---|---|
| `gotenberg` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  gotenberg:
    image: gotenberg/gotenberg:latest
    environment:
      # NOTE: requires the --api-enable-basic-auth option in "command"
      #       make sure to also change the credentials in Dokploy environment
      GOTENBERG_API_BASIC_AUTH_USERNAME: ${GOTENBERG_API_BASIC_AUTH_USERNAME}
      GOTENBERG_API_BASIC_AUTH_PASSWORD: ${GOTENBERG_API_BASIC_AUTH_PASSWORD}
    command:
      - gotenberg
      # See the full list of options at https://gotenberg.dev/docs/configuration

      # Examples:
      # - --api-timeout=60s
      # - --chromium-auto-start
      - --api-enable-basic-auth
      - --api-disable-health-check-logging
    restart: unless-stopped
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
