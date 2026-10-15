---
title: Hospedar Enshrouded com Rustploy
description: "Servidor dedicado para o jogo multiplayer Enshrouded via Steam. Crie Enshrouded em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Enshrouded**: Servidor dedicado para o jogo multiplayer Enshrouded via Steam. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `enshrouded` |
| **Containers** | 1 (`enshrouded`) |
| **Imagens** | `mornedhels/enshrouded-server:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Enshrouded** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `SERVER_NAME` | Enshrouded Dokploy |
| `SERVER_PASSWORD` | *senha aleatória de 15 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SERVER_NAME` | ${SERVER_NAME} |
| `SERVER_PASSWORD` | ${SERVER_PASSWORD} |

## docker-compose.yml do template

```yaml
services:
  enshrouded:
    image: mornedhels/enshrouded-server:latest
    container_name: enshrouded
    hostname: enshrouded
    restart: unless-stopped
    stop_grace_period: 90s
    ports:
      - "15637:15637/udp"
      - "27015:27015/udp"
    volumes:
      - enshrouded-persistent-data:/opt/enshrouded
    # only add ntsync device if your kernel supports it (6.14 or newer)
    # devices:
    #   - /dev/ntsync:/dev/ntsync
    environment:
      - SERVER_NAME=${SERVER_NAME}
      - SERVER_PASSWORD=${SERVER_PASSWORD}
      - SERVER_SLOT_COUNT=6
      - UPDATE_CRON=0 3 * * *
      - PUID=4711
      - PGID=4711

volumes:
  enshrouded-persistent-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
