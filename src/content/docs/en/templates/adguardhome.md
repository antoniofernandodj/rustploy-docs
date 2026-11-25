---
title: Host AdGuard Home with Rustploy
description: "Network-wide DNS ad and tracker blocker. Create AdGuard Home in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AdGuard Home**: Network-wide DNS ad and tracker blocker. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `adguardhome` |
| **Containers** | 1 (`adguardhome`) |
| **Images** | `adguard/adguardhome:latest` |
| **UI port** | 3000, on service `adguardhome` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AdGuard Home** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `adguardhome` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  adguardhome:
    image: adguard/adguardhome:latest
    restart: unless-stopped
    ports:
      - "53:53/tcp" # DNS
      - "53:53/udp" # DNS
      - "67:67/udp" # DHCP Server
      - "68:68/tcp" # DHCP Client
      - "853:853/tcp" # DNS over TLS, DNS-over-QUIC
      - "853:853/udp" # DNS over TLS, DNS-over-QUIC
      - "6060:6060/tcp" # HTTP (pprof)
    volumes:
      - adguardhome-work:/opt/adguardhome/work
      - adguardhome-conf:/opt/adguardhome/conf

volumes:
  adguardhome-work: {}
  adguardhome-conf: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
