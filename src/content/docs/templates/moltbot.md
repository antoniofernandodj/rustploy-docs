---
title: Hospedar Moltbot com Rustploy
description: "Gateway e agente CLI de WhatsApp integrado com inteligência artificial. Crie Moltbot em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Moltbot**: Gateway e agente CLI de WhatsApp integrado com inteligência artificial. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `moltbot` |
| **Containers** | 1 (`moltbot-gateway`) |
| **Imagens** | `ghcr.io/moltbot/clawdbot:2026.1.24-1` |
| **Porta da interface** | 18789, no serviço `moltbot-gateway` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Moltbot** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `gateway_token` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CLAWDBOT_GATEWAY_TOKEN` | ${gateway_token} |
| `CLAWDBOT_GATEWAY_PORT` | 18789 |
| `CLAWDBOT_BRIDGE_PORT` | 18790 |
| `CLAWDBOT_GATEWAY_BIND` | lan |
| `CLAWDBOT_PLUGINS` | discord,memory-core |
| `OPENROUTER_API_KEY` | YOUR-API-KEY |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `moltbot-gateway` | 18789 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
