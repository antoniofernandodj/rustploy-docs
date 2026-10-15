---
title: Host Directory Lister with Rustploy
description: "Simple PHP script for listing and browsing web directories. Create Directory Lister in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Directory Lister**: Simple PHP script for listing and browsing web directories. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `directory-lister` |
| **Containers** | 1 (`directory-lister`) |
| **Images** | `directorylister/directorylister:latest` |
| **UI port** | 80, on service `directory-lister` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Directory Lister** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `app_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `APP_LANGUAGE` | en |
| `DISPLAY_READMES` | true |
| `READMES_FIRST` | false |
| `ZIP_DOWNLOADS` | true |
| `TIMEZONE` | UTC |

## Domains

| Service | Port | Host |
|---|---|---|
| `directory-lister` | 80 | ${app_domain} |

## The template docker-compose.yml

```yaml
services:
  directory-lister:
    image: directorylister/directorylister:latest
    restart: unless-stopped
    ports:
      # The internal port of the application.
      - 80
    volumes:
      # Mounts a persistent named volume to store directory data.
      - directory-lister-data:/data

volumes:
  # Defines the Docker-managed volume for data persistence.
  directory-lister-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
