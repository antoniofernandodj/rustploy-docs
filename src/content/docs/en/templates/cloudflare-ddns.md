---
title: Host Cloudflare DDNS with Rustploy
description: "Robust script that automatically updates Dynamic DNS on Cloudflare. Create Cloudflare DDNS in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cloudflare DDNS**: Robust script that automatically updates Dynamic DNS on Cloudflare. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cloudflare-ddns` |
| **Containers** | 1 (`cloudflare-ddns`) |
| **Images** | `favonia/cloudflare-ddns:1` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cloudflare DDNS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | <INSERT YOUR TOKEN> |
| `DOMAINS` | example.org,www.example.org,example.io |

## The template docker-compose.yml

```yaml
# For more details, see:
# - https://github.com/favonia/cloudflare-ddns
services:
  cloudflare-ddns:
    image: favonia/cloudflare-ddns:1
    network_mode: host
    restart: unless-stopped
    user: "1000:1000"
    read_only: true
    cap_drop: [all]
    security_opt: [no-new-privileges:true]
    environment:
      - CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN:?}
      - DOMAINS=${DOMAINS:?}
      - PROXIED=false
      - IP6_PROVIDER=none
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
