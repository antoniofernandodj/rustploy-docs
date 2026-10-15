---
title: Host Mealie with Rustploy
description: "Mealie application. Create Mealie in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mealie**: Mealie application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mealie` |
| **Containers** | 1 (`mealie`) |
| **Images** | `ghcr.io/mealie-recipes/mealie:latest` |
| **UI port** | 9000, on service `mealie` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mealie** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `TZ` | Europe/London |
| `BASE_URL` | https://${main_domain} |
| `SMTP_HOST` |  |
| `SMTP_PORT` | 587 |
| `SMTP_AUTH_STRATEGY` | TLS |
| `SMTP_FROM_NAME` | Mealie |
| `SMTP_FROM_EMAIL` |  |
| `SMTP_USER` |  |
| `SMTP_PASSWORD` |  |
| `API_DOCS` | False |
| `ALLOW_SIGNUP` | false |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `BASE_URL` | ${BASE_URL} |
| `TZ` | ${TZ} |
| `DEFAULT_GROUP` | Home |
| `DEFAULT_HOUSEHOLD` | Family |
| `API_DOCS` | ${API_DOCS} |
| `SECURITY_MAX_LOGIN_ATTEMPTS` | 10 |
| `SECURITY_USER_LOCKOUT_TIME` | 24 |
| `DAILY_SCHEDULE_TIME` | 01:00 |
| `ALLOW_SIGNUP` | ${ALLOW_SIGNUP} |
| `SMTP_HOST` | ${SMTP_HOST} |
| `SMTP_PORT` | ${SMTP_PORT} |
| `SMTP_AUTH_STRATEGY` | ${SMTP_AUTH_STRATEGY} |
| `SMTP_FROM_NAME` | ${SMTP_FROM_NAME} |
| `SMTP_FROM_EMAIL` | ${SMTP_FROM_EMAIL} |
| `SMTP_USER` | ${SMTP_USER} |
| `SMTP_PASSWORD` | ${SMTP_PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `mealie` | 9000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  mealie:
    image: ghcr.io/mealie-recipes/mealie:latest
    deploy:
      resources:
        limits:
          memory: 1000M
    volumes:
      - mealie-data:/app/data/
    environment:
      PUID: 1000
      PGID: 1000

      # Basic settings
      BASE_URL: ${BASE_URL}
      API_DOCS: ${API_DOCS}
      ALLOW_SIGNUP: ${ALLOW_SIGNUP}
      DEFAULT_GROUP: ${DEFAULT_GROUP}
      DEFAULT_HOUSEHOLD: ${DEFAULT_HOUSEHOLD}
      TZ: ${TZ}
      SECURITY_MAX_LOGIN_ATTEMPTS: ${SECURITY_MAX_LOGIN_ATTEMPTS}
      SECURITY_USER_LOCKOUT_TIME: ${SECURITY_USER_LOCKOUT_TIME}
      DAILY_SCHEDULE_TIME: ${DAILY_SCHEDULE_TIME}

      # Email settings
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_AUTH_STRATEGY: ${SMTP_AUTH_STRATEGY}
      SMTP_FROM_NAME: ${SMTP_FROM_NAME}
      SMTP_FROM_EMAIL: ${SMTP_FROM_EMAIL}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}

volumes:
  mealie-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
