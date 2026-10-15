---
title: Hospedar EMQX com Rustploy
description: "Broker MQTT massivamente escalável para projetos IoT e veículos conectados. Crie EMQX em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**EMQX**: Broker MQTT massivamente escalável para projetos IoT e veículos conectados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `emqx` |
| **Containers** | 1 (`emqx`) |
| **Imagens** | `emqx/emqx-enterprise:6.0.1` |
| **Porta da interface** | 18083, no serviço `emqx` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **EMQX** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `emqx` | 18083 | emqx.yourdomain.com |
| `emqx` | 8083 | broker.yourdomain.com |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
