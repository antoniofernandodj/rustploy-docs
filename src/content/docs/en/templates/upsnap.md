---
title: Host Upsnap with Rustploy
description: "Simple dashboard integrated with PocketBase to send Wake-on-LAN packets and monitor network devices. Create Upsnap in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Upsnap**: Simple dashboard integrated with PocketBase to send Wake-on-LAN packets and monitor network devices. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `upsnap` |
| **Containers** | 1 (`upsnap`) |
| **Images** | `ghcr.io/seriousm4x/upsnap:5` |
| **UI port** | 8090, on service `upsnap` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Upsnap** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `upsnap_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TZ` | Europe/Berlin |
| `UPSNAP_INTERVAL` | */10 * * * * * |
| `UPSNAP_SCAN_RANGE` | 192.168.1.0/24 |
| `UPSNAP_SCAN_TIMEOUT` | 500ms |
| `UPSNAP_PING_PRIVILEGED` | true |
| `UPSNAP_WEBSITE_TITLE` | Upsnap Network Monitor |

## Domains

| Service | Port | Host |
|---|---|---|
| `upsnap` | 8090 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  upsnap:
    image: ghcr.io/seriousm4x/upsnap:5
    restart: unless-stopped
    expose:
      - 8090
    volumes:
      - upsnap-data:/app/pb_data
    environment:
      - TZ=${TZ}
      - UPSNAP_INTERVAL=${UPSNAP_INTERVAL}
      - UPSNAP_SCAN_RANGE=${UPSNAP_SCAN_RANGE}
      - UPSNAP_SCAN_TIMEOUT=${UPSNAP_SCAN_TIMEOUT}
      - UPSNAP_PING_PRIVILEGED=${UPSNAP_PING_PRIVILEGED}
      - UPSNAP_WEBSITE_TITLE=${UPSNAP_WEBSITE_TITLE}
    healthcheck:
      test: ["CMD", "curl", "-fs", "http://localhost:8090/api/health"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  upsnap-data:
    driver: local
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
