---
title: Host Tolgee with Rustploy
description: "Web platform for managing and translating software localization strings. Create Tolgee in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Tolgee**: Web platform for managing and translating software localization strings. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `tolgee` |
| **Containers** | 1 (`app`) |
| **Images** | `tolgee/tolgee:latest` |
| **UI port** | 8080, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Tolgee** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TOLGEE_AUTHENTICATION_ENABLED` | true |
| `TOLGEE_AUTHENTICATION_INITIAL_PASSWORD` | admin |
| `TOLGEE_AUTHENTICATION_INITIAL_USERNAME` | admin |
| `TOLGEE_AUTHENTICATION_JWT_SECRET` | *generated JWT* |
| `TOLGEE_MACHINE_TRANSLATION_GOOGLE_API_KEY` | my_google_api_key |
| `TOLGEE_SMTP_AUTH` | true |
| `TOLGEE_SMTP_FROM` | Tolgee <no-reply@mydomain.com> |
| `TOLGEE_SMTP_HOST` | email-smtp.regional-region.amazonaws.com |
| `TOLGEE_SMTP_PASSWORD` | omg/my/password |
| `TOLGEE_SMTP_PORT` | 465 |
| `TOLGEE_SMTP_SSL_ENABLED` | true |
| `TOLGEE_SMTP_USERNAME` | user@company.com |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3"


services:
  app:
    image: tolgee/tolgee:latest
    volumes:
      - ./data:/data
      - ./config.yaml:/config.yaml
    ports:
      - '8080'
    environment:
      TOLGEE_FRONT_END_URL: ${TOLGEE_HOST}
      TOLGEE_AUTHENTICATION_ENABLED: ${TOLGEE_AUTHENTICATION_ENABLED}
      TOLGEE_AUTHENTICATION_INITIAL_PASSWORD: ${TOLGEE_AUTHENTICATION_INITIAL_PASSWORD}
      TOLGEE_AUTHENTICATION_INITIAL_USERNAME: ${TOLGEE_AUTHENTICATION_INITIAL_USERNAME}
      TOLGEE_AUTHENTICATION_JWT_SECRET: ${TOLGEE_AUTHENTICATION_JWT_SECRET}
      TOLGEE_MACHINE_TRANSLATION_GOOGLE_API_KEY: ${TOLGEE_MACHINE_TRANSLATION_GOOGLE_API_KEY}
      TOLGEE_SMTP_AUTH: ${TOLGEE_SMTP_AUTH}
      TOLGEE_SMTP_FROM: ${TOLGEE_SMTP_FROM}
      TOLGEE_SMTP_HOST: ${TOLGEE_SMTP_HOST}
      TOLGEE_SMTP_PASSWORD: ${TOLGEE_SMTP_PASSWORD}
      TOLGEE_SMTP_PORT: ${TOLGEE_SMTP_PORT}
      TOLGEE_SMTP_SSL_ENABLED: ${TOLGEE_SMTP_SSL_ENABLED}
      TOLGEE_SMTP_USERNAME: ${TOLGEE_SMTP_USERNAME}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
