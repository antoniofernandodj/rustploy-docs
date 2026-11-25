---
title: Host Cloud Commander with Rustploy
description: "Web file manager with built-in terminal and editor. Create Cloud Commander in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cloud Commander**: Web file manager with built-in terminal and editor. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cloudcommander` |
| **Containers** | 1 (`cloudcmd`) |
| **Images** | `coderaiser/cloudcmd:18.5.1` |
| **UI port** | 80, on service `cloudcmd` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cloud Commander** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `USERNAME` | user |
| `PASSWORD` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `USERNAME` | ${USERNAME} |
| `PASSWORD` | ${PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `cloudcmd` | 80 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  cloudcmd:
    image: coderaiser/cloudcmd:18.5.1
    ports:
      - "80"
    environment:
      - CLOUDCMD_ROOT=/mnt/fs
      - CLOUDCMD_AUTH=true
      - CLOUDCMD_USERNAME=${USERNAME}
      - CLOUDCMD_PASSWORD=${PASSWORD}
    volumes:
      - /root:/root
      - /:/mnt/fs
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
