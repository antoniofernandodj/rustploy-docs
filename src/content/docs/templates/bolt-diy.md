---
title: Hospedar bolt.diy com Rustploy
description: "Ferramenta para rodar, editar e implantar apps full-stack usando qualquer LLM. Crie bolt.diy em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**bolt.diy**: Ferramenta para rodar, editar e implantar apps full-stack usando qualquer LLM. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bolt.diy` |
| **Containers** | 1 (`app`) |
| **Imagens** | `ghcr.io/stackblitz-labs/bolt.diy:latest` |
| **Porta da interface** | 5173, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **bolt.diy** e selecione.
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 5173 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
