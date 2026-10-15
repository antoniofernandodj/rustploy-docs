---
title: Host Autobase with Rustploy
description: "Open-source alternative to cloud-managed databases. Create Autobase in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Autobase**: Open-source alternative to cloud-managed databases. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `autobase` |
| **Containers** | 1 (`autobase-console`) |
| **Images** | `autobase/console:2.5.2` |
| **UI port** | 80, on service `autobase-console` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Autobase** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |
| `authenticattion_token` | *random base64 key (32 bytes)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PG_CONSOLE_API_URL` | http://${api_domain}/api/v1 |
| `PG_CONSOLE_AUTHORIZATION_TOKEN` | ${authenticattion_token} |

## Domains

| Service | Port | Host |
|---|---|---|
| `autobase-console` | 80 | ${main_domain} |
| `autobase-console` | 8080 | ${api_domain} |

## The template docker-compose.yml

```yaml
services:
  autobase-console:
    image: autobase/console:2.5.2
    restart: unless-stopped
    ports:
      - "80"
      - "8080"
    environment:
      - PG_CONSOLE_API_URL=${PG_CONSOLE_API_URL}
      - PG_CONSOLE_AUTHORIZATION_TOKEN=${PG_CONSOLE_AUTHORIZATION_TOKEN}
    volumes:
      - console_postgres:/var/lib/postgresql
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/ansible:/tmp/ansible

volumes:
  console_postgres:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
