---
title: Host RustDesk with Rustploy
description: "Remote access and screen control server (open alternative to TeamViewer/AnyDesk). Create RustDesk in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**RustDesk**: Remote access and screen control server (open alternative to TeamViewer/AnyDesk). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `rustdesk` |
| **Containers** | 2 (`hbbs`, `hbbr`) |
| **Images** | `rustdesk/rustdesk-server:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **RustDesk** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `server_domain` | *domain (generated; replace it with yours)* |
| `encryption_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `RELAY_HOST` | ${server_domain} |
| `RUSTDESK_RELAY_SERVER` | ${server_domain}:21117 |
| `RUSTDESK_API_SERVER` | http://${server_domain}:21118 |
| `RUSTDESK_ID_SERVER` | ${server_domain}:21116 |
| `ENCRYPTION_KEY` | ${encryption_key} |

## The template docker-compose.yml

```yaml
services:
  hbbs:
    image: rustdesk/rustdesk-server:latest
    command: hbbs
    restart: unless-stopped
    volumes:
      - rustdesk-data:/root
    ports:
      - "21115:21115"
      - "21116:21116"
      - "21116:21116/udp"
    depends_on:
      - hbbr

  hbbr:
    image: rustdesk/rustdesk-server:latest
    command: hbbr
    restart: unless-stopped
    volumes:
      - rustdesk-data:/root
    ports:
      - "21117:21117"
      - "21118:21118"
      - "21119:21119"

volumes:
  rustdesk-data:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
