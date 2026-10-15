---
title: Hospedar Openclaw com Rustploy
description: "Gateway CLI alternativo focado no ecossistema de mensagens automatizadas do WhatsApp. Crie Openclaw em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Openclaw**: Gateway CLI alternativo focado no ecossistema de mensagens automatizadas do WhatsApp. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `openclaw` |
| **Containers** | 2 (`openclaw`, `browser`) |
| **Imagens** | `coollabsio/openclaw:2026.2.6`, `coollabsio/openclaw-browser:latest` |
| **Porta da interface** | 8080, no serviço `openclaw` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Openclaw** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `gateway_token` | *senha aleatória de 32 caracteres* |
| `auth_username` | dokploy |
| `auth_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `OPENCLAW_GATEWAY_TOKEN` | ${gateway_token} |
| `OPENCLAW_GATEWAY_PORT` | 18789 |
| `AUTH_USERNAME` | ${auth_username} |
| `AUTH_PASSWORD` | ${auth_password} |
| `OPENCLAW_BRIDGE_PORT` | 18790 |
| `OPENCLAW_GATEWAY_BIND` | lan |
| `OPENCLAW_PLUGINS` | discord,memory-core |
| `OPENROUTER_API_KEY` | YOUR-API-KEY |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `openclaw` | 8080 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
services:
  openclaw:
    image: "coollabsio/openclaw:2026.2.6"
    environment:
      - AUTH_USERNAME=${AUTH_USERNAME}
      - AUTH_PASSWORD=${AUTH_PASSWORD}
      - OPENCLAW_GATEWAY_TOKEN=${OPENCLAW_GATEWAY_TOKEN}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - XAI_API_KEY=${XAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - CEREBRAS_API_KEY=${CEREBRAS_API_KEY}
      - VENICE_API_KEY=${VENICE_API_KEY}
      - MOONSHOT_API_KEY=${MOONSHOT_API_KEY}
      - KIMI_API_KEY=${KIMI_API_KEY}
      - MINIMAX_API_KEY=${MINIMAX_API_KEY}
      - ZAI_API_KEY=${ZAI_API_KEY}
      - AI_GATEWAY_API_KEY=${AI_GATEWAY_API_KEY}
      - OPENCODE_API_KEY=${OPENCODE_API_KEY}
      - SYNTHETIC_API_KEY=${SYNTHETIC_API_KEY}
      - COPILOT_GITHUB_TOKEN=${COPILOT_GITHUB_TOKEN}
      - XIAOMI_API_KEY=${XIAOMI_API_KEY}
      - OPENCLAW_PRIMARY_MODEL=${OPENCLAW_PRIMARY_MODEL}
      - DEEPGRAM_API_KEY=${DEEPGRAM_API_KEY}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION:-us-east-1}
      - AWS_SESSION_TOKEN=${AWS_SESSION_TOKEN}
      - BEDROCK_PROVIDER_FILTER=${BEDROCK_PROVIDER_FILTER:-anthropic}
      - OLLAMA_BASE_URL=${OLLAMA_BASE_URL}
      - PORT=8080
      - OPENCLAW_GATEWAY_PORT=18789
      - OPENCLAW_GATEWAY_BIND=${OPENCLAW_GATEWAY_BIND:-loopback}
      - OPENCLAW_STATE_DIR=/data/.openclaw
      - OPENCLAW_WORKSPACE_DIR=/data/workspace
      - BROWSER_CDP_URL=http://browser:9223
      - BROWSER_DEFAULT_PROFILE=${BROWSER_DEFAULT_PROFILE:-openclaw}
      - BROWSER_EVALUATE_ENABLED=${BROWSER_EVALUATE_ENABLED:-true}
      - BROWSER_SNAPSHOT_MODE=${BROWSER_SNAPSHOT_MODE:-efficient}
      - BROWSER_REMOTE_TIMEOUT_MS=${BROWSER_REMOTE_TIMEOUT_MS:-1500}
      - BROWSER_REMOTE_HANDSHAKE_TIMEOUT_MS=${BROWSER_REMOTE_HANDSHAKE_TIMEOUT_MS:-3000}
      - HOOKS_ENABLED=${HOOKS_ENABLED:-false}
      - HOOKS_PATH=${HOOKS_PATH:-/hooks}
      - MOONSHOT_BASE_URL=${MOONSHOT_BASE_URL:-https://api.moonshot.ai/v1}
      - KIMI_BASE_URL=${KIMI_BASE_URL:-https://api.moonshot.ai/anthropic}
      - TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
      - DISCORD_BOT_TOKEN=$DISCORD_BOT_TOKEN
      - SLACK_BOT_TOKEN=$SLACK_BOT_TOKEN
      - SLACK_APP_TOKEN=$SLACK_APP_TOKEN
      - WHATSAPP_ENABLED=$WHATSAPP_ENABLED
      - OPENCLAW_DOCKER_APT_PACKAGES=$OPENCLAW_DOCKER_APT_PACKAGES
    volumes:
      - "openclaw-data:/data"
    depends_on:
      browser:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://127.0.0.1:8080/healthz"]
      interval: 10s
      timeout: 10s
      retries: 5


  browser:
    image: "coollabsio/openclaw-browser:latest"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Etc/UTC
      - CHROME_CLI=--remote-debugging-port=9222
    volumes:
      - "browser-data:/config"
    shm_size: 2g
    healthcheck:
      test: ["CMD-SHELL", "bash -c ':> /dev/tcp/127.0.0.1/9222' || exit 1"]
      interval: 5s
      timeout: 5s
      retries: 10


volumes:
  openclaw-data:
  browser-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
