---
title: Host EMQX with Rustploy
description: "Massively scalable MQTT broker for IoT and connected vehicles. Create EMQX in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**EMQX**: Massively scalable MQTT broker for IoT and connected vehicles. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `emqx` |
| **Containers** | 1 (`emqx`) |
| **Images** | `emqx/emqx-enterprise:6.0.1` |
| **UI port** | 18083, on service `emqx` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **EMQX** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Domains

| Service | Port | Host |
|---|---|---|
| `emqx` | 18083 | emqx.yourdomain.com |
| `emqx` | 8083 | broker.yourdomain.com |

## The template docker-compose.yml

```yaml
# This templates requires additional traefik port mapping and entry point
# for port 8883 (mqtts over TCP)
#
# For the full instructions, refer to:
# - https://github.com/Dokploy/dokploy/discussions/3126
#
# The initial login credentials are:
# - USERNAME: admin
# - PASSWORD: public

services:
  emqx:
    image: emqx/emqx-enterprise:6.0.1
    hostname: node1.emqx.com
    environment:
      EMQX_NODE_NAME: emqx@node1.emqx.com
    expose:
      - 1883  # MQTT
      - 8083  # WS
      - 18083 # Dashboard
    volumes:
      - emqx_data:/opt/emqx/data
      - emqx_log:/opt/emqx/log
    networks:
      dokploy-network:
        aliases:
          - emqx-service
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "/opt/emqx/bin/emqx_ctl", "status"]
      interval: 30s
      timeout: 5s
      retries: 3
    labels:
      # MQTT over TLS
      - "traefik.tcp.routers.emqx-mqtts.entrypoints=mqtts"
      - "traefik.tcp.routers.emqx-mqtts.rule=HostSNI(`broker.yourdomain.com`)" # Change domain
      - "traefik.tcp.routers.emqx-mqtts.tls.certresolver=letsencrypt"
      - "traefik.tcp.routers.emqx-mqtts.service=emqx-service"
      - "traefik.tcp.services.emqx-service.loadbalancer.server.port=1883"

  #
  # Optional Web UI:
  # - https://github.com/emqx/MQTTX/tree/main/web
  #
  # mqttx-web:
  #   image: emqx/mqttx-web:latest
  #   expose:
  #     - 80
  #

volumes:
  emqx_data:
  emqx_log:

networks:
  dokploy-network:
    external: true
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
