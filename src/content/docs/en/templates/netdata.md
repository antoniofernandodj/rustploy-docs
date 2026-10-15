---
title: Host Netdata with Rustploy
description: "Real-time infrastructure analytics monitor with per-second detailed metrics. Create Netdata in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Netdata**: Real-time infrastructure analytics monitor with per-second detailed metrics. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `netdata` |
| **Containers** | 1 (`netdata`) |
| **Images** | `netdata/netdata:latest` |
| **UI port** | 19999, on service `netdata` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Netdata** and select it.
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
| `netdata` | 19999 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  netdata:
    image: netdata/netdata:latest
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      - netdata-config:/etc/netdata
      - netdata-lib:/var/lib/netdata
      - netdata-cache:/var/cache/netdata
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      - NETDATA_CLAIM_TOKEN=${NETDATA_CLAIM_TOKEN:-}
      - NETDATA_CLAIM_URL=${NETDATA_CLAIM_URL:-}
      - NETDATA_CLAIM_ROOMS=${NETDATA_CLAIM_ROOMS:-}
    ports:
      - "19999"

volumes:
  netdata-config:
  netdata-lib:
  netdata-cache:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
