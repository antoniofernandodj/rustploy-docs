---
title: Host Blinko with Rustploy
description: "Modern app for quick notes and flow organization. Create Blinko in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Blinko**: Modern app for quick notes and flow organization. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `blinko` |
| **Containers** | 2 (`blinko-website`, `blinko-postgres`) |
| **Images** | `blinkospace/blinko:1.6.3`, `postgres:14` |
| **UI port** | 1111, on service `blinko-website` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Blinko** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_password` | *random password, 32 characters* |
| `nextauth_secret` | *random password, 32 characters* |
| `database_url` | postgresql://postgres:${postgres_password}@blinko-postgres:5432/postgres |
| `nextauth_url` | http://${main_domain} |
| `next_public_base_url` | http://${main_domain} |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NEXTAUTH_SECRET` | ${nextauth_secret} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `DATABASE_URL` | ${database_url} |
| `NEXTAUTH_URL` | ${nextauth_url} |
| `NEXT_PUBLIC_BASE_URL` | ${next_public_base_url} |

## Domains

| Service | Port | Host |
|---|---|---|
| `blinko-website` | 1111 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  blinko-website:
    image: blinkospace/blinko:1.6.3
    environment:
      NODE_ENV: production
      # API Key for NextAuth
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXT_PUBLIC_BASE_URL: ${NEXT_PUBLIC_BASE_URL}
    depends_on:
      blinko-postgres:
        condition: service_healthy
    restart: always
    logging:
      options:
        max-size: "10m"
        max-file: "3"
    ports:
      - 1111

  blinko-postgres:
    image: postgres:14
    restart: always
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      TZ: Asia/Shanghai
    volumes:
      - blinko-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres", "-d", "postgres"]
      interval: 5s
      timeout: 10s
      retries: 5

volumes:
  blinko-db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
