---
title: Host Poste.io with Rustploy
description: "Complete corporate mail server (SMTP, IMAP, antivirus) in a single stable image. Create Poste.io in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Poste.io**: Complete corporate mail server (SMTP, IMAP, antivirus) in a single stable image. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `poste.io` |
| **Containers** | 1 (`mailserver`) |
| **Images** | `analogic/poste.io` |
| **UI port** | 8080, on service `mailserver` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Poste.io** and select it.
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
| `TZ` | UTC |

## Domains

| Service | Port | Host |
|---|---|---|
| `mailserver` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  mailserver:
    image: analogic/poste.io
    restart: unless-stopped
    hostname: mail.${DOMAIN}
    ports:
      - "25:25"
      - "110:110"
      - "143:143"
      - "465:465"
      - "587:587"
      - "993:993"
      - "995:995"
      - "4190:4190"
    environment:
      - TZ=${TZ}
      - HTTPS=OFF
      - HTTP_PORT=8080
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - poste-data:/data

volumes:
  poste-data: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
