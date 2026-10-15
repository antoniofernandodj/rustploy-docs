---
title: Host RustFS with Rustploy
description: "S3-compatible distributed file system written in Rust, with very high performance. Create RustFS in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**RustFS**: S3-compatible distributed file system written in Rust, with very high performance. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rustfs` |
| **Containers** | 1 (`rustfs`) |
| **Images** | `rustfs/rustfs:latest` |
| **UI port** | 9001, on service `rustfs` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **RustFS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `console_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |
| `access_key` | rustfsadmin |
| `secret_key` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `RUSTFS_ACCESS_KEY` | ${access_key} |
| `RUSTFS_SECRET_KEY` | ${secret_key} |
| `` |  |
| `## SET THE API URL IN CONSOLE CONFIG BY CLICKING THE COG` |  |
| `## API URL: ${api_domain}` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `rustfs` | 9001 | ${console_domain} |
| `rustfs` | 9000 | ${api_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  rustfs:
    image: rustfs/rustfs:latest
    volumes:
      - rustfs-data:/data
    environment:
      - RUSTFS_ACCESS_KEY
      - RUSTFS_SECRET_KEY
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_CONSOLE_ENABLE=true
      - RUSTFS_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS=*
    command: /data
    restart: unless-stopped

volumes:
  rustfs-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
