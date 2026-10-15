---
title: Host Kutt with Rustploy
description: "Modern URL shortener with custom domain support and analytics. Create Kutt in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Kutt**: Modern URL shortener with custom domain support and analytics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kutt` |
| **Containers** | 1 (`kutt`) |
| **Images** | `kutt/kutt:main` |
| **UI port** | 3000, on service `kutt` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Kutt** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `jwt_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `JWT_SECRET` | *generated JWT* |
| `DEFAULT_DOMAIN` | ${main_domain} |
| `TRUST_PROXY` | false |
| `DISALLOW_ANONYMOUS_LINKS` | true |
| `CUSTOM_DOMAIN_USE_HTTPS` | true |
| `MAIL_ENABLED` | false |
| `MAIL_HOST` | '' |
| `MAIL_PORT` | '22' |
| `MAIL_SECURE` | true |
| `MAIL_USER` | '' |
| `MAIL_FROM` | '' |
| `MAIL_PASSWORD` | '' |
| `CONTACT_EMAIL` | '' |

## Domains

| Service | Port | Host |
|---|---|---|
| `kutt` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  kutt:
    image: kutt/kutt:main
    volumes:
      - kutt_db_data:/var/lib/kutt
      - ./kutt/custom:/kutt/custom
    environment:
      DB_FILENAME: "/var/lib/kutt/data.sqlite"
      JWT_SECRET: ${JWT_SECRET}
      DEFAULT_DOMAIN: ${DEFAULT_DOMAIN}
      TRUST_PROXY: ${TRUST_PROXY}
      DISALLOW_ANONYMOUS_LINKS: ${DISALLOW_ANONYMOUS_LINKS}
      CUSTOM_DOMAIN_USE_HTTPS: ${CUSTOM_DOMAIN_USE_HTTPS}
      MAIL_ENABLED: ${MAIL_ENABLED}
      MAIL_HOST: ${MAIL_HOST}
      MAIL_PORT: ${MAIL_PORT}
      MAIL_SECURE: ${MAIL_SECURE}
      MAIL_USER: ${MAIL_USER}
      MAIL_FROM: ${MAIL_FROM}
      MAIL_PASSWORD: ${MAIL_PASSWORD}
      CONTACT_EMAIL: ${CONTACT_EMAIL}

volumes:
  kutt_db_data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
