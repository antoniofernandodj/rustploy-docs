---
title: Host Homebridge with Rustploy
description: "Emulator that brings Apple HomeKit compatibility to legacy devices. Create Homebridge in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Homebridge**: Emulator that brings Apple HomeKit compatibility to legacy devices. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `homebridge` |
| **Containers** | 1 (`homebridge`) |
| **Images** | `homebridge/homebridge:latest` |
| **UI port** | 8581, on service `homebridge` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Homebridge** and select it.
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
| `homebridge` | 8581 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  homebridge:
    image: homebridge/homebridge:latest
    restart: always
    ports:
      - 8581
    volumes:
      - ./volumes/homebridge:/homebridge
    healthcheck:
      test: ["CMD", "curl", "-f", "http://homebridge:8581/"]
      interval: 60s
      retries: 5
      start_period: 300s
      timeout: 2s
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
