---
title: Host Home Assistant with Rustploy
description: "The definitive open-source ecosystem for private home automation. Create Home Assistant in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Home Assistant**: The definitive open-source ecosystem for private home automation. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `homeassistant` |
| **Containers** | 1 (`homeassistant`) |
| **Images** | `ghcr.io/home-assistant/home-assistant:stable` |
| **UI port** | 8123, on service `homeassistant` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Home Assistant** and select it.
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
| `homeassistant` | 8123 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `configuration.yaml`

## The template docker-compose.yml

```yaml
services:
  homeassistant:
    image: ghcr.io/home-assistant/home-assistant:stable
    restart: unless-stopped
    ports:
      - 8123
    volumes:
      - ../files/configuration.yaml:/config/configuration.yaml
      - ../files/automations.yaml:/config/automations.yaml
      - ../files/scripts.yaml:/config/scripts.yaml
      - ../files/scenes.yaml:/config/scenes.yaml
      - /opt/homeassistant:/config
      - /etc/localtime:/etc/localtime:ro
      - /run/dbus:/run/dbus:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://homeassistant:8123/"]
      interval: 60s
      retries: 5
      start_period: 300s
      timeout: 2s
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
