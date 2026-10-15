---
title: Host Agent DVR with Rustploy
description: "Complete video surveillance and monitoring system with AI. Create Agent DVR in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Agent DVR**: Complete video surveillance and monitoring system with AI. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `agentdvr` |
| **Containers** | 1 (`agentdvr`) |
| **Images** | `mekayelanik/ispyagentdvr:latest` |
| **UI port** | 8090, on service `agentdvr` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Agent DVR** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `timezone` | America/New_York |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `TIMEZONE` | ${timezone} |

## Domains

| Service | Port | Host |
|---|---|---|
| `agentdvr` | 8090 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  agentdvr:
    image: mekayelanik/ispyagentdvr:latest
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${TIMEZONE:-America/New_York}
      - AGENTDVR_WEBUI_PORT=8090
    volumes:
      - agentdvr-config:/AgentDVR/Media/XML/
      - agentdvr-media:/AgentDVR/Media/WebServerRoot/Media/
      - agentdvr-commands:/AgentDVR/Commands/
    ports:
      - 8090
      - 3478/udp
      - 50000-50100/udp

volumes:
  agentdvr-config: {}
  agentdvr-media: {}
  agentdvr-commands: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
