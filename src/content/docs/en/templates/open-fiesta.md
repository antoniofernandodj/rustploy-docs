---
title: Host Open Fiesta with Rustploy
description: "AI chat inference interface supporting multiple backends (Ollama/Gemini). Create Open Fiesta in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Open Fiesta**: AI chat inference interface supporting multiple backends (Ollama/Gemini). Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `open-fiesta` |
| **Containers** | 1 (`ai_fiesta`) |
| **Images** | `ghcr.io/jaainil/open-fiesta-ghcr:latest` |
| **UI port** | 3000, on service `ai_fiesta` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Open Fiesta** and select it.
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
| `OPENROUTER_API_KEY` | ${OPENROUTER_API_KEY} |
| `GEMINI_API_KEY` | ${GEMINI_API_KEY} |
| `UNSTABLE_INFERENCE_API_KEY` | ${UNSTABLE_INFERENCE_API_KEY} |
| `OLLAMA_URL` | ${OLLAMA_URL} |

## Domains

| Service | Port | Host |
|---|---|---|
| `ai_fiesta` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  ai_fiesta:
    image: ghcr.io/jaainil/open-fiesta-ghcr:latest
    restart: unless-stopped
    environment:
      NODE_ENV: production
      OPENROUTER_API_KEY: ${OPENROUTER_API_KEY}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      UNSTABLE_INFERENCE_API_KEY: ${UNSTABLE_INFERENCE_API_KEY}
      OLLAMA_URL: ${OLLAMA_URL}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
