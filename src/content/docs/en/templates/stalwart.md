---
title: Host Stalwart with Rustploy
description: "Complete modern mail server written in Rust with JMAP, IMAP and native encryption support. Create Stalwart in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Stalwart**: Complete modern mail server written in Rust with JMAP, IMAP and native encryption support. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `stalwart` |
| **Containers** | 1 (`stalwart-mail`) |
| **Images** | `stalwartlabs/stalwart:latest-alpine` |
| **UI port** | 8080, on service `stalwart-mail` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Stalwart** and select it.
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
| `stalwart-mail` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  stalwart-mail:
    image: stalwartlabs/stalwart:latest-alpine # for production choose specific version from https://hub.docker.com/r/stalwartlabs/stalwart/tags
    ports:
      - "443"    # HTTPS
      - "8080"   # HTTP API
      - "25"     # SMTP
      - "587"    # Submission
      - "465"    # SMTPS
      - "143"    # IMAP
      - "993"    # IMAPS
      - "4190"   # ManageSieve
      - "110"    # POP3
      - "995"    # POP3S
    volumes:
      - stalwart_data:/opt/stalwart-mail
    restart: unless-stopped

volumes:
  stalwart_data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
