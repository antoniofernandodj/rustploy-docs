---
title: Host Linkwarden with Rustploy
description: "Link manager focused on full archiving and preservation of web pages. Create Linkwarden in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Linkwarden**: Link manager focused on full archiving and preservation of web pages. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `linkwarden` |
| **Containers** | 2 (`linkwarden`, `postgres`) |
| **Images** | `ghcr.io/linkwarden/linkwarden:v2.9.3`, `postgres:17-alpine` |
| **UI port** | 3000, on service `linkwarden` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Linkwarden** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password* |
| `next_secret` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `NEXTAUTH_SECRET` | ${next_secret} |
| `NEXTAUTH_URL` | http://${main_domain}/api/v1/auth |

## Domains

| Service | Port | Host |
|---|---|---|
| `linkwarden` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  linkwarden:
    environment:
      - NEXTAUTH_SECRET
      - NEXTAUTH_URL
      - DATABASE_URL=postgresql://linkwarden:${POSTGRES_PASSWORD}@postgres:5432/linkwarden
    restart: unless-stopped
    image: ghcr.io/linkwarden/linkwarden:v2.9.3
    ports:
      - 3000
    volumes:
      - linkwarden-data:/data/data
    depends_on:
      - postgres
    healthcheck:
      test: curl --fail http://localhost:3000 || exit 1
      interval: 60s
      retries: 2
      start_period: 60s
      timeout: 15s

  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    user: postgres
    environment:
      POSTGRES_USER: linkwarden
      POSTGRES_DB: linkwarden
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  linkwarden-data:
  postgres-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
