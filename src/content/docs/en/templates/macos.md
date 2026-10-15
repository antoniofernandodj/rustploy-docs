---
title: Host Macos with Rustploy
description: "Macos application. Create Macos in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Macos**: Macos application. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `macos` |
| **Containers** | 1 (`macos`) |
| **Images** | `dockurr/macos:1.14` |
| **UI port** | 8006, on service `macos` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Macos** and select it.
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
| `VERSION` | 15 |
| `DISK_SIZE` | 64G |
| `RAM_SIZE` | 4G |
| `CPU_CORES` | 2 |

## Domains

| Service | Port | Host |
|---|---|---|
| `macos` | 8006 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  macos:
    image: dockurr/macos:1.14
    volumes:
    - macos-storage:/storage
    environment:
      - VERSION
    devices:
      # If in .env string 'KVM=N' is not commented, you need to comment line below
      - /dev/kvm
    cap_add:
      - NET_ADMIN
    stop_grace_period: 2m

volumes:
  macos-storage:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
