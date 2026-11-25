---
title: Host TriliumNext with Rustploy
description: "Maintained, updated fork of the Trilium Notes hierarchical organizer, with improvements. Create TriliumNext in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**TriliumNext**: Maintained, updated fork of the Trilium Notes hierarchical organizer, with improvements. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `trilium-next` |
| **Containers** | 1 (`trilium_next`) |
| **Images** | `triliumnext/trilium:v0.101.3` |
| **UI port** | 8080, on service `trilium_next` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **TriliumNext** and select it.
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
| `TRILIUM_DATA_DIR` | /root |

## Domains

| Service | Port | Host |
|---|---|---|
| `trilium_next` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
# Running `docker-compose up` will create/use the "trilium-data" directory in the user home
services:
  trilium_next:
    # Optionally, replace `latest` with a version tag like `v0.110.3`
    # Using `latest` may cause unintended updates to the container
    image: triliumnext/trilium:v0.101.3
    # Restart the container unless it was stopped by the user
    restart: unless-stopped
    environment:
      - TRILIUM_DATA_DIR=/home/node/trilium-data
    ports:
      # By default, Trilium will be available at http://localhost:8080
      # It will also be accessible at http://<host-ip>:8080
      # You might want to limit this with something like Docker Networks, reverse proxies, or firewall rules,
      # however be aware that using UFW is known to not work with default Docker installations, see:
      # https://docs.docker.com/engine/network/packet-filtering-firewalls/#docker-and-ufw
      - "8080"
    volumes:
      # Unless TRILIUM_DATA_DIR is set, the data will be stored in the "trilium-data" directory in the home directory.
      # This can also be changed with by replacing the line below with `- /path/of/your/choice:/home/node/trilium-data
      - ${TRILIUM_DATA_DIR:-~/trilium-data}:/home/node/trilium-data
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
