---
title: Host File Browser with Rustploy
description: "Full-featured web file manager with user control. Create File Browser in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**File Browser**: Full-featured web file manager with user control. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `filebrowser` |
| **Containers** | 1 (`filebrowser`) |
| **Images** | `hurlenko/filebrowser` |
| **UI port** | 8080, on service `filebrowser` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **File Browser** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `FB_BASEURL` | /filebrowser |

## Domains

| Service | Port | Host |
|---|---|---|
| `filebrowser` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  filebrowser:
    image: hurlenko/filebrowser
    volumes:
      - filebrowser-data:/data
      - filebrowser-config:/config
    environment:
      - FB_BASEURL=${FB_BASEURL}
    restart: always 

volumes:
  filebrowser-data:
  filebrowser-config:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
