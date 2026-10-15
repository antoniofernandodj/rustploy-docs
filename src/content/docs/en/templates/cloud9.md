---
title: Host Cloud9 with Rustploy
description: "Complete cloud IDE for real-time collaborative coding. Create Cloud9 in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cloud9**: Complete cloud IDE for real-time collaborative coding. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cloud9` |
| **Containers** | 1 (`cloud9`) |
| **Images** | `lscr.io/linuxserver/cloud9:1.29.2` |
| **UI port** | 8000, on service `cloud9` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cloud9** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `USERNAME` | user |
| `PASSWORD` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `USERNAME` | ${USERNAME} |
| `PASSWORD` | ${PASSWORD} |

## Domains

| Service | Port | Host |
|---|---|---|
| `cloud9` | 8000 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
version: "3"

services:
  cloud9:
    image: lscr.io/linuxserver/cloud9:1.29.2
    ports:
      - "8000"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
      - GITURL=https://github.com/linuxserver/docker-cloud9.git
      - USERNAME=${USERNAME}
      - PASSWORD=${PASSWORD}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - code:/code

volumes:
  code:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
