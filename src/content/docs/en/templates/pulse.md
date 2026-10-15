---
title: Host Pulse with Rustploy
description: "Responsive panel for centralized monitoring of Proxmox VE and Docker environments. Create Pulse in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Pulse**: Responsive panel for centralized monitoring of Proxmox VE and Docker environments. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pulse` |
| **Containers** | 1 (`pulse`) |
| **Images** | `rcourtman/pulse:5.1` |
| **UI port** | 7655, on service `pulse` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Pulse** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `pulse_auth_user` | *generated username* |
| `pulse_auth_pass` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `PULSE_AUTH_USER` | ${pulse_auth_user} |
| `PULSE_AUTH_PASS` | ${pulse_auth_pass} |

## Domains

| Service | Port | Host |
|---|---|---|
| `pulse` | 7655 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  pulse:
    image: rcourtman/pulse:5.1
    restart: always
    expose:
      - 7655
    volumes:
      - pulse_data:/data
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - PULSE_AUTH_USER=${PULSE_AUTH_USER}
      - PULSE_AUTH_PASS=${PULSE_AUTH_PASS}
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:7655/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  pulse_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
