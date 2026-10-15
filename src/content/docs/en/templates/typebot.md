---
title: Host Typebot with Rustploy
description: "Visual builder for conversation flows and interactive chatbots using draggable blocks. Create Typebot in one click on Rustploy: 3 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Typebot**: Visual builder for conversation flows and interactive chatbots using draggable blocks. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `typebot` |
| **Containers** | 3 (`typebot-db`, `typebot-builder`, `typebot-viewer`) |
| **Images** | `postgres:14-alpine`, `baptistearno/typebot-builder:2.27`, `baptistearno/typebot-viewer:2.27.0` |
| **UI port** | 3000, on service `typebot-builder` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Typebot** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `builder_domain` | *domain (generated; replace it with yours)* |
| `viewer_domain` | *domain (generated; replace it with yours)* |
| `encryption_secret` | *random base64 key (24 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ENCRYPTION_SECRET` | ${encryption_secret} |
| `NEXTAUTH_URL` | http://${builder_domain} |
| `NEXT_PUBLIC_VIEWER_URL` | http://${viewer_domain} |
| `ADMIN_EMAIL` | typebot@example.com |
| `SMTP_HOST` | 'Fill' |
| `SMTP_PORT` | 25 |
| `SMTP_USERNAME` | 'Fill' |
| `SMTP_PASSWORD` | 'Fill' |
| `NEXT_PUBLIC_SMTP_FROM` | typebot@example.com |
| `DEFAULT_WORKSPACE_PLAN` | UNLIMITED |

## Domains

| Service | Port | Host |
|---|---|---|
| `typebot-builder` | 3000 | ${builder_domain} |
| `typebot-viewer` | 3000 | ${viewer_domain} |

## The template docker-compose.yml

```yaml
version: '3.3'

volumes:
  db-data:

services:
  typebot-db:
    image: postgres:14-alpine
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: typebot
      POSTGRES_DB: typebot
      POSTGRES_PASSWORD: typebot


  typebot-builder:
    image: baptistearno/typebot-builder:2.27
    restart: always
    depends_on:
      - typebot-db
    environment:
      ENCRYPTION_SECRET: '${ENCRYPTION_SECRET}'
      DATABASE_URL: 'postgresql://typebot:typebot@typebot-db:5432/typebot'
      NEXTAUTH_URL: '${NEXTAUTH_URL}'
      NEXT_PUBLIC_VIEWER_URL: '${NEXT_PUBLIC_VIEWER_URL}'
      ADMIN_EMAIL: '${ADMIN_EMAIL}'
      SMTP_HOST: '${SMTP_HOST}'
      NEXT_PUBLIC_SMTP_FROM: '${NEXT_PUBLIC_SMTP_FROM}'
      SMTP_USERNAME: '${SMTP_USERNAME}'
      SMTP_PASSWORD: '${SMTP_PASSWORD}'
      DEFAULT_WORKSPACE_PLAN: '${DEFAULT_WORKSPACE_PLAN}'

  typebot-viewer:
    image: baptistearno/typebot-viewer:2.27.0
    restart: always
    environment:
      ENCRYPTION_SECRET: '${ENCRYPTION_SECRET}'
      DATABASE_URL: postgresql://typebot:typebot@typebot-db:5432/typebot
      NEXTAUTH_URL: '${NEXTAUTH_URL}'
      NEXT_PUBLIC_VIEWER_URL: '${NEXT_PUBLIC_VIEWER_URL}'
      ADMIN_EMAIL: '${ADMIN_EMAIL}'
      SMTP_HOST: '${SMTP_HOST}'
      NEXT_PUBLIC_SMTP_FROM: '${NEXT_PUBLIC_SMTP_FROM}'
      SMTP_USERNAME: '${SMTP_USERNAME}'
      SMTP_PASSWORD: '${SMTP_PASSWORD}'
      DEFAULT_WORKSPACE_PLAN: '${DEFAULT_WORKSPACE_PLAN}'
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
