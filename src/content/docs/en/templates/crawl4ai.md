---
title: Host Crawl4AI with Rustploy
description: "AI-optimized web crawler with Markdown and LLM extraction. Create Crawl4AI in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Crawl4AI**: AI-optimized web crawler with Markdown and LLM extraction. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `crawl4ai` |
| **Containers** | 1 (`crawl4ai`) |
| **Images** | `unclecode/crawl4ai:latest` |
| **UI port** | 11235, on service `crawl4ai` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Crawl4AI** and select it.
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
| `LLM_PROVIDER` | openai/gpt-4o-mini |
| `OPENAI_API_KEY` | *random password, 48 characters* |
| `ANTHROPIC_API_KEY` |  |
| `DEEPSEEK_API_KEY` |  |
| `GROQ_API_KEY` |  |
| `TOGETHER_API_KEY` |  |
| `MISTRAL_API_KEY` |  |
| `GEMINI_API_TOKEN` |  |

## Domains

| Service | Port | Host |
|---|---|---|
| `crawl4ai` | 11235 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  crawl4ai:
    image: unclecode/crawl4ai:latest
    restart: unless-stopped
    shm_size: 1g
    expose:
      - 11235
    environment:
      - LLM_PROVIDER=${LLM_PROVIDER}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - TOGETHER_API_KEY=${TOGETHER_API_KEY}
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - GEMINI_API_TOKEN=${GEMINI_API_TOKEN}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:11235/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
