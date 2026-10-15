---
title: Host DumbDrop with Rustploy
description: "Temporary, anonymous one-time file sharing. Create DumbDrop in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**DumbDrop**: Temporary, anonymous one-time file sharing. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `dumbdrop` |
| **Containers** | 1 (`dumbdrop`) |
| **Images** | `dumbwareio/dumbdrop:latest` |
| **UI port** | 3000, on service `dumbdrop` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **DumbDrop** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | https://*domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `UPLOAD_DIR` | /app/uploads |
| `DUMBDROP_TITLE` | DumbDrop |
| `MAX_FILE_SIZE` | 1024 |
| `DUMBDROP_PIN` | *random password, 6 characters* |
| `AUTO_UPLOAD` | true |
| `BASE_URL` | ${main_domain} |
| `ALLOWED_ORIGINS` |  |
| `APPRISE_URL` |  |
| `APPRISE_MESSAGE` | New file uploaded {filename} ({size}), Storage used {storage} |
| `APPRISE_SIZE_UNIT` | Auto |
| `ALLOWED_EXTENSIONS` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `dumbdrop` | 3000 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
services:
  dumbdrop:
    image: dumbwareio/dumbdrop:latest
    restart: unless-stopped
    ports:
      - 3000
    volumes:
      - dumbdrop-uploads:/app/uploads
volumes:
  dumbdrop-uploads: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
