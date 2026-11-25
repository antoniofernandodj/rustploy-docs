---
title: Host MCSManager with Rustploy
description: "Distributed web panel for managing Minecraft servers and game instances. Create MCSManager in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**MCSManager**: Distributed web panel for managing Minecraft servers and game instances. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `mcsmanager` |
| **Containers** | 2 (`web`, `daemon`) |
| **Images** | `githubyumao/mcsmanager-web:latest`, `githubyumao/mcsmanager-daemon:latest` |
| **UI port** | 23333, on service `web` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **MCSManager** and select it.
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
| `web` | 23333 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  web:
    image: githubyumao/mcsmanager-web:latest
    restart: unless-stopped
    ports:
      - 23333
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - mcsmanager-web-data:/opt/mcsmanager/web/data
      - mcsmanager-web-logs:/opt/mcsmanager/web/logs
  daemon:
    image: githubyumao/mcsmanager-daemon:latest
    restart: unless-stopped
    ports:
      - 24444
    environment:
      - MCSM_DOCKER_WORKSPACE_PATH=/opt/mcsmanager/daemon/data/InstanceData
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - mcsmanager-daemon-data:/opt/mcsmanager/daemon/data
      - mcsmanager-daemon-logs:/opt/mcsmanager/daemon/logs
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  mcsmanager-web-data:
  mcsmanager-web-logs:
  mcsmanager-daemon-data:
  mcsmanager-daemon-logs:
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
