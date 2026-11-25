---
title: Host WG-Easy with Rustploy
description: "Simple, friendly graphical interface to install and manage WireGuard-based VPN servers. Create WG-Easy in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**WG-Easy**: Simple, friendly graphical interface to install and manage WireGuard-based VPN servers. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `wg-easy` |
| **Containers** | 1 (`wg-easy`) |
| **Images** | `ghcr.io/wg-easy/wg-easy:15` |
| **UI port** | 51821, on service `wg-easy` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **WG-Easy** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `wg_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `WIREGUARD_HOST` | ${main_domain} |
| `WIREGUARD_PASSWORD` | ${wg_password} |

## Domains

| Service | Port | Host |
|---|---|---|
| `wg-easy` | 51821 | ${main_domain} |

## The template docker-compose.yml

```yaml
volumes:
  etc_wireguard:

services:
  wg-easy:
    environment:
      - INIT_ENABLED=1
      - INIT_HOST=${WIREGUARD_HOST}
      - INIT_PORT=51820
      - INIT_USERNAME=admin
      - INIT_PASSWORD=${WIREGUARD_PASSWORD}
      - INIT_DNS=1.1.1.1,8.8.8.8
      - PORT=51821
    image: ghcr.io/wg-easy/wg-easy:15
    container_name: wg-easy
    volumes:
      - etc_wireguard:/etc/wireguard
      - /lib/modules:/lib/modules:ro
    ports:
      - "51820:51820/udp"
      - "51821:51821/tcp"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
      - NET_RAW
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv6.conf.all.disable_ipv6=0
      - net.ipv6.conf.all.forwarding=1
      - net.ipv6.conf.default.forwarding=1
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
