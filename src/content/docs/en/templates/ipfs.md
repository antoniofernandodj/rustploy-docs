---
title: Host Ipfs with Rustploy
description: "Ipfs application. Create Ipfs in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Ipfs**: Ipfs application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `ipfs` |
| **Containers** | 1 (`ipfs`) |
| **Images** | `ipfs/kubo:latest` |
| **UI port** | 8080, on service `ipfs` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Ipfs** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `gateway_domain` | *domain (generated; replace it with yours)* |
| `api_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `ipfs` | 8080 | ${gateway_domain} |
| `ipfs` | 5001 | ${api_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `/container-init.d/001-configure-api.sh`

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  ipfs:
    image: ipfs/kubo:latest
    restart: unless-stopped
    environment:
      - IPFS_PROFILE=server
    volumes:
      - ipfs_data:/data/ipfs
      - ipfs_staging:/export
    ports:
      - 4001
      - 8080
      - 5001
volumes:
  ipfs_data: {}
  ipfs_staging: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
