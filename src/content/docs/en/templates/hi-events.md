---
title: Host Hi.events with Rustploy
description: "Integrated ticket sales and local event management platform. Create Hi.events in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Hi.events**: Integrated ticket sales and local event management platform. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `hi-events` |
| **Containers** | 2 (`all-in-one`, `postgres`) |
| **Images** | `daveearley/hi.events-all-in-one:v0.8.0-beta.1`, `elestio/postgres:16` |
| **UI port** | 80, on service `all-in-one` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Hi.events** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `jwt_secret` | *random password* |
| `app_key` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DOMAIN` | ${main_domain} |
| `POSTGRES_DB` | hievents |
| `POSTGRES_USER` | hievents |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `VITE_STRIPE_PUBLISHABLE_KEY` |  |
| `APP_KEY` | ${app_key} |
| `JWT_SECRET` | *generated JWT* |
| `MAIL_MAILER` |  |
| `MAIL_HOST` |  |
| `MAIL_PORT` |  |
| `MAIL_FROM_ADDRESS` |  |
| `MAIL_FROM_NAME` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `all-in-one` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  all-in-one:
    image: daveearley/hi.events-all-in-one:v0.8.0-beta.1
    restart: always
    environment:
      - VITE_FRONTEND_URL=https://${DOMAIN}
      - APP_FRONTEND_URL=https://${DOMAIN}
      - VITE_API_URL_CLIENT=https://${DOMAIN}/api
      - VITE_API_URL_SERVER=http://localhost:80/api
      - VITE_STRIPE_PUBLISHABLE_KEY
      - LOG_CHANNEL=stderr
      - QUEUE_CONNECTION=sync
      - MAIL_MAILER=array
      - APP_KEY
      - JWT_SECRET
      - FILESYSTEM_PUBLIC_DISK=public
      - FILESYSTEM_PRIVATE_DISK=local
      - APP_CDN_URL=https://${DOMAIN}/storage
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - MAIL_MAILER
      - MAIL_HOST
      - MAIL_PORT
      - MAIL_FROM_ADDRESS
      - MAIL_FROM_NAME
    depends_on:
      - postgres

  postgres:
    image: elestio/postgres:16
    restart: always

    environment:
      - POSTGRES_DB
      - POSTGRES_USER
      - POSTGRES_PASSWORD
    volumes:
      - pg_hi-events_data:/var/lib/postgresql/data

volumes:
  pg_hi-events_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
