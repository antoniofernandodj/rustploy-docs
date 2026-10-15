---
title: Host Snapp with Rustploy
description: "Agile server for capturing, uploading and sharing screenshots and images with access control. Create Snapp in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Snapp**: Agile server for capturing, uploading and sharing screenshots and images with access control. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `snapp` |
| **Containers** | 1 (`snapp`) |
| **Images** | `uraniadev/snapp:0.9-rc-020` |
| **UI port** | 3000, on service `snapp` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Snapp** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `token_secret` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DATABASE_URL` | file:./db.sqlite |
| `DATABASE_PROVIDER` | sqlite |
| `DISABLED_EMAIL_AND_PASSWORD` | false |
| `LOG_LEVEL` | debug |
| `ORIGIN` | http://${main_domain} |
| `PORT` | 3000 |
| `ADMIN_USERNAME` | admin |
| `ADMIN_EMAIL` | info@example.org |
| `ADMIN_PASSWORD` | *random password, 16 characters* |
| `TOKEN_SECRET` | ${token_secret} |
| `ENABLE_SIGNUP` | true |
| `ENABLED_MFA` | false |
| `PUBLIC_URL` | ${main_domain} |
| `APPNAME` | Snapp |
| `PUBLIC_EXTRA_GROUPS_EDITABLE` | true |
| `URLS_VIA_GROUPS_ONLY` | false |
| `HOST` | 0.0.0.0 |

## Domains

| Service | Port | Host |
|---|---|---|
| `snapp` | 3000 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/files/snapp-db/db.sqlite`

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  snapp:
    image: uraniadev/snapp:0.9-rc-020
    ports:
      - 3000
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DATABASE_PROVIDER=${DATABASE_PROVIDER}
      - TOKEN_SECRET=${TOKEN_SECRET} # API Key for authentication token
      - ORIGIN=${ORIGIN}
      - DISABLED_EMAIL_AND_PASSWORD=${DISABLED_EMAIL_AND_PASSWORD}
      - LOG_LEVEL=${LOG_LEVEL}
      - PORT=${PORT}
      - ADMIN_USERNAME=${ADMIN_USERNAME}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - ENABLE_SIGNUP=${ENABLE_SIGNUP}
      - ENABLED_MFA=${ENABLED_MFA}
      - PUBLIC_URL=${PUBLIC_URL}
      - APPNAME=${APPNAME}
      - PUBLIC_EXTRA_GROUPS_EDITABLE=${PUBLIC_EXTRA_GROUPS_EDITABLE}
      - URLS_VIA_GROUPS_ONLY=${URLS_VIA_GROUPS_ONLY}
      - HOST=${HOST}
    volumes:
      - ../files/snapp-db:/app/db.sqlite
volumes:
  snapp-db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
