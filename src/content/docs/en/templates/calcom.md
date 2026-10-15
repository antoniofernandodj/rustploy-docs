---
title: Host Calcom with Rustploy
description: "Meeting scheduler (Calendly alternative). Create Calcom in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Calcom**: Meeting scheduler (Calendly alternative). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `calcom` |
| **Containers** | 2 (`postgres`, `calcom`) |
| **Images** | `postgres:16-alpine`, `calcom/cal.com:v2.7.6` |
| **UI port** | 3000, on service `calcom` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Calcom** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `calcom_encryption_key` | *random base64 key (32 bytes)* |
| `nextauth_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CALCOM_HOST` | ${main_domain} |
| `NEXTAUTH_SECRET` | ${nextauth_secret} |
| `CALENDSO_ENCRYPTION_KEY` | ${calcom_encryption_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `calcom` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine

    volumes:
      - calcom-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=db
      - DATABASE_URL=postgres://postgres:password@postgres:5432/db

  calcom:
    image: calcom/cal.com:v2.7.6
    depends_on:
      - postgres
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - CALENDSO_ENCRYPTION_KEY=${CALENDSO_ENCRYPTION_KEY}
      - DATABASE_URL=postgres://postgres:password@postgres:5432/db
      - NEXT_PUBLIC_WEBAPP_URL=http://${CALCOM_HOST}
      - NEXTAUTH_URL=http://${CALCOM_HOST}/api/auth

volumes:
  calcom-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
