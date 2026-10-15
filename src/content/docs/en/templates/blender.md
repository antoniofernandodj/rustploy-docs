---
title: Host Blender with Rustploy
description: "Complete suite for 3D creation, modeling and rendering. Create Blender in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Blender**: Complete suite for 3D creation, modeling and rendering. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `blender` |
| **Containers** | 1 (`blender`) |
| **Images** | `lscr.io/linuxserver/blender:latest` |
| **UI port** | 3000, on service `blender` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Blender** and select it.
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
| `PUID` | 1000 |
| `PGID` | 1000 |
| `TZ` | Etc/UTC |
| `SUBFOLDER` | / |
| `NVIDIA_VISIBLE_DEVICES` | all |
| `NVIDIA_DRIVER_CAPABILITIES` | all |

## Domains

| Service | Port | Host |
|---|---|---|
| `blender` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  blender:
    image: lscr.io/linuxserver/blender:latest
    runtime: nvidia
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities:
                - gpu
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=all
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - SUBFOLDER=/ #optional
    ports:
      - 3000
      - 3001
    restart: unless-stopped
    shm_size: 1gb
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
