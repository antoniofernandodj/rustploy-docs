---
title: Host Openclaw with Rustploy
description: "Alternative CLI gateway focused on the WhatsApp automated-messaging ecosystem. Create Openclaw in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Openclaw**: Alternative CLI gateway focused on the WhatsApp automated-messaging ecosystem. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `openclaw` |
| **Containers** | 2 (`openclaw`, `browser`) |
| **Images** | `coollabsio/openclaw:2026.2.6`, `coollabsio/openclaw-browser:latest` |
| **UI port** | 8080, on service `openclaw` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Openclaw** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `gateway_token` | *random password, 32 characters* |
| `auth_username` | dokploy |
| `auth_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `OPENCLAW_GATEWAY_TOKEN` | ${gateway_token} |
| `OPENCLAW_GATEWAY_PORT` | 18789 |
| `AUTH_USERNAME` | ${auth_username} |
| `AUTH_PASSWORD` | ${auth_password} |
| `OPENCLAW_BRIDGE_PORT` | 18790 |
| `OPENCLAW_GATEWAY_BIND` | lan |
| `OPENCLAW_PLUGINS` | discord,memory-core |
| `OPENROUTER_API_KEY` | YOUR-API-KEY |

## Domains

| Service | Port | Host |
|---|---|---|
| `openclaw` | 8080 | *domain (generated; replace it with yours)* |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
