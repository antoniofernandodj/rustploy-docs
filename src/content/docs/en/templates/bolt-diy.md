---
title: Host bolt.diy with Rustploy
description: "Tool to run, edit and deploy full-stack apps using any LLM. Create bolt.diy in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**bolt.diy**: Tool to run, edit and deploy full-stack apps using any LLM. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `bolt.diy` |
| **Containers** | 1 (`app`) |
| **Images** | `ghcr.io/stackblitz-labs/bolt.diy:latest` |
| **UI port** | 5173, on service `app` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **bolt.diy** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `GROQ_API_KEY` |  |
| `HuggingFace_API_KEY` |  |
| `OPENAI_API_KEY` |  |
| `ANTHROPIC_API_KEY` |  |
| `OPEN_ROUTER_API_KEY` |  |
| `GOOGLE_GENERATIVE_AI_API_KEY` |  |
| `OLLAMA_API_BASE_URL` | http://127.0.0.1:11434 |
| `XAI_API_KEY` |  |
| `TOGETHER_API_KEY` |  |
| `TOGETHER_API_BASE_URL` |  |
| `AWS_BEDROCK_CONFIG` |  |
| `DEFAULT_NUM_CTX` | 32768 |

## Domains

| Service | Port | Host |
|---|---|---|
| `app` | 5173 | ${main_domain} |

## The template docker-compose.yml

```yaml
services:
  app:
    image: ghcr.io/stackblitz-labs/bolt.diy:latest
    environment:
      - NODE_ENV=production
      - COMPOSE_PROFILES=production
      - PORT=5173
      - GROQ_API_KEY=${GROQ_API_KEY}
      - HuggingFace_API_KEY=${HuggingFace_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPEN_ROUTER_API_KEY=${OPEN_ROUTER_API_KEY}
      - GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
      - OLLAMA_API_BASE_URL=${OLLAMA_API_BASE_URL}
      - XAI_API_KEY=${XAI_API_KEY}
      - TOGETHER_API_KEY=${TOGETHER_API_KEY}
      - TOGETHER_API_BASE_URL=${TOGETHER_API_BASE_URL}
      - AWS_BEDROCK_CONFIG=${AWS_BEDROCK_CONFIG}
      - VITE_LOG_LEVEL=${VITE_LOG_LEVEL:-info}
      - DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX:-32768}
      - RUNNING_IN_DOCKER=true
    extra_hosts:
      - "host.docker.internal:host-gateway"
    command: pnpm run dockerstart
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
