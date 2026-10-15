---
title: Hospedar Crawl4AI com Rustploy
description: "Web crawler otimizado para IA com suporte a extrações em Markdown e LLM. Crie Crawl4AI em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Crawl4AI**: Web crawler otimizado para IA com suporte a extrações em Markdown e LLM. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `crawl4ai` |
| **Containers** | 1 (`crawl4ai`) |
| **Imagens** | `unclecode/crawl4ai:latest` |
| **Porta da interface** | 11235, no serviço `crawl4ai` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Crawl4AI** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LLM_PROVIDER` | openai/gpt-4o-mini |
| `OPENAI_API_KEY` | *senha aleatória de 48 caracteres* |
| `ANTHROPIC_API_KEY` |  |
| `DEEPSEEK_API_KEY` |  |
| `GROQ_API_KEY` |  |
| `TOGETHER_API_KEY` |  |
| `MISTRAL_API_KEY` |  |
| `GEMINI_API_TOKEN` |  |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `crawl4ai` | 11235 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
