---
title: Host Neko with Rustploy
description: "Shared virtual browser running directly inside a Docker container (via WebRTC/VNC). Create Neko in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Neko**: Shared virtual browser running directly inside a Docker container (via WebRTC/VNC). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `neko` |
| **Containers** | 1 (`neko`) |
| **Images** | `ghcr.io/m1k1o/neko/firefox:latest` |
| **UI port** | 8080, on service `neko` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Neko** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `admin_password` | *random password, 16 characters* |
| `user_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `NEKO_MEMBER_PROVIDER` | multiuser |
| `NEKO_DESKTOP_SCREEN` | 1920x1080@30 |
| `NEKO_MEMBER_MULTIUSER_USER_PASSWORD` | ${user_password} |
| `NEKO_MEMBER_MULTIUSER_ADMIN_PASSWORD` | ${admin_password} |
| `NEKO_WEBRTC_EPR` | 52000-52100 |
| `NEKO_WEBRTC_ICELITE` | 1 |

## Domains

| Service | Port | Host |
|---|---|---|
| `neko` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  neko:
    image: "ghcr.io/m1k1o/neko/firefox:latest"
    restart: "unless-stopped"
    shm_size: "2gb"
    ports:
      - "8080"
      - "52000-52100:52000-52100/udp"
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
