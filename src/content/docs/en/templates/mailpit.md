---
title: Host Mailpit with Rustploy
description: "Local fake SMTP server for testing and inspecting development emails. Create Mailpit in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Mailpit**: Local fake SMTP server for testing and inspecting development emails. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mailpit` |
| **Containers** | 1 (`mailpit`) |
| **Images** | `axllent/mailpit:v1.22.3` |
| **UI port** | 8025, on service `mailpit` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Mailpit** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `default_password` | *random password* |

## Domains

| Service | Port | Host |
|---|---|---|
| `mailpit` | 8025 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  mailpit:
    image: axllent/mailpit:v1.22.3
    restart: unless-stopped
    ports:
      - '1025:1025'
    volumes:
      - 'mailpit-data:/data'
    environment:
      - MP_SMTP_AUTH_ALLOW_INSECURE=true
      - MP_MAX_MESSAGES=5000
      - MP_DATABASE=/data/mailpit.db
      - MP_UI_AUTH=${MP_UI_AUTH}
      - MP_SMTP_AUTH=${MP_SMTP_AUTH}
    healthcheck:
      test:
        - CMD
        - /mailpit
        - readyz
      interval: 5s
      timeout: 20s
      retries: 10

volumes:
  mailpit-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
