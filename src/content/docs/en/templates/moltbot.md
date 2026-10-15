---
title: Host Moltbot with Rustploy
description: "WhatsApp gateway and CLI agent integrated with artificial intelligence. Create Moltbot in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Moltbot**: WhatsApp gateway and CLI agent integrated with artificial intelligence. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `moltbot` |
| **Containers** | 1 (`moltbot-gateway`) |
| **Images** | `ghcr.io/moltbot/clawdbot:2026.1.24-1` |
| **UI port** | 18789, on service `moltbot-gateway` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Moltbot** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `gateway_token` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `CLAWDBOT_GATEWAY_TOKEN` | ${gateway_token} |
| `CLAWDBOT_GATEWAY_PORT` | 18789 |
| `CLAWDBOT_BRIDGE_PORT` | 18790 |
| `CLAWDBOT_GATEWAY_BIND` | lan |
| `CLAWDBOT_PLUGINS` | discord,memory-core |
| `OPENROUTER_API_KEY` | YOUR-API-KEY |

## Domains

| Service | Port | Host |
|---|---|---|
| `moltbot-gateway` | 18789 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

```yaml
services:
  moltbot-gateway:
    image: ghcr.io/moltbot/clawdbot:2026.1.24-1
    environment:
      HOME: /home/node
      TERM: xterm-256color
      CLAWDBOT_GATEWAY_TOKEN: ${CLAWDBOT_GATEWAY_TOKEN}
      CLAUDE_AI_SESSION_KEY: ${CLAUDE_AI_SESSION_KEY}
      CLAUDE_WEB_SESSION_KEY: ${CLAUDE_WEB_SESSION_KEY}
      CLAUDE_WEB_COOKIE: ${CLAUDE_WEB_COOKIE}
      CLAWDBOT_GATEWAY_URL: ws://0.0.0.0:18789
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
    volumes:
      - moltbot-config:/home/node/.clawdbot
      - moltbot-workspace:/home/node/clawd
    ports:
      - "18789"
      - "18790"
    init: true
    restart: unless-stopped
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "auto",
        "--port",
        "18789",
        "--allow-unconfigured"
      ]

volumes:
  moltbot-config:
  moltbot-workspace:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
