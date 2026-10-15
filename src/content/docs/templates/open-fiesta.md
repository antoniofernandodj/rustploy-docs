---
title: Hospedar Open Fiesta com Rustploy
description: "Interface de inferência para chat de IA com suporte a múltiplos backends (Ollama/Gemini). Crie Open Fiesta em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Open Fiesta**: Interface de inferência para chat de IA com suporte a múltiplos backends (Ollama/Gemini). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `open-fiesta` |
| **Containers** | 1 (`ai_fiesta`) |
| **Imagens** | `ghcr.io/jaainil/open-fiesta-ghcr:latest` |
| **Porta da interface** | 3000, no serviço `ai_fiesta` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Open Fiesta** e selecione.
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
| `OPENROUTER_API_KEY` | ${OPENROUTER_API_KEY} |
| `GEMINI_API_KEY` | ${GEMINI_API_KEY} |
| `UNSTABLE_INFERENCE_API_KEY` | ${UNSTABLE_INFERENCE_API_KEY} |
| `OLLAMA_URL` | ${OLLAMA_URL} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ai_fiesta` | 3000 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
