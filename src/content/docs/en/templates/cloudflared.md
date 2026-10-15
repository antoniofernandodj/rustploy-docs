---
title: Host Cloudflared with Rustploy
description: "Daemon that securely connects local services to the internet via Cloudflare Tunnel. Create Cloudflared in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Cloudflared**: Daemon that securely connects local services to the internet via Cloudflare Tunnel. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `cloudflared` |
| **Containers** | 1 (`cloudflared`) |
| **Images** | `cloudflare/cloudflared:latest` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Cloudflared** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CLOUDFLARE_TUNNEL_TOKEN` |  |

## The template docker-compose.yml

```yaml
services:
  cloudflared:
    image: 'cloudflare/cloudflared:latest'
    environment:
      # Don't forget to set this in your Dokploy Environment
      - 'TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN:?}'
    network_mode: host
    restart: unless-stopped
    command: [
      "tunnel",

      # More tunnel run parameters here:
      # https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/cloudflared-parameters/run-parameters/
      "--no-autoupdate",
      #"--protocol", "http2",

      "run"
    ]
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
