---
title: Host Spacedrive with Rustploy
description: "Cross-platform file manager built on a virtual distributed file system (VDFS) in Rust. Create Spacedrive in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Spacedrive**: Cross-platform file manager built on a virtual distributed file system (VDFS) in Rust. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `spacedrive` |
| **Containers** | 1 (`server`) |
| **Images** | `ghcr.io/spacedriveapp/spacedrive/server:latest` |
| **UI port** | 8080, on service `server` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Spacedrive** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `SD_USERNAME` | admin |
| `SD_PASSWORD` | ${secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `server` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  server:
    image: ghcr.io/spacedriveapp/spacedrive/server:latest
    ports:
      - 8080
    environment:
      - SD_AUTH=${SD_USERNAME}:${SD_PASSWORD}
    volumes:
      - /var/spacedrive:/var/spacedrive
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
