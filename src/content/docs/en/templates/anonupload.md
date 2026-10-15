---
title: Host AnonUpload with Rustploy
description: "Anonymous, secure file sharing (no database). Create AnonUpload in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AnonUpload**: Anonymous, secure file sharing (no database). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `anonupload` |
| **Containers** | 1 (`anonupload`) |
| **Images** | `ghcr.io/supernova3339/anonfiles:1` |
| **UI port** | 80, on service `anonupload` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AnonUpload** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_email` | *generated email* |
| `admin_password` | *random password, 16 characters* |
| `contact_email` | *generated email* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `ADMIN_EMAIL` | ${admin_email} |
| `ADMIN_PASSWORD` | ${admin_password} |
| `CONTACT_EMAIL` | ${contact_email} |

## Domains

| Service | Port | Host |
|---|---|---|
| `anonupload` | 80 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  anonupload:
    image: ghcr.io/supernova3339/anonfiles:1
    restart: unless-stopped
    ports:
      - 80
    environment:
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD}
      - CONTACT_EMAIL=${CONTACT_EMAIL}
    volumes:
      - uploads:/var/www/html/uploads

volumes:
  uploads: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
