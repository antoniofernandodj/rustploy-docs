---
title: Hospedar Kokoro TTS com Rustploy
description: "Wrapper FastAPI em Docker para síntese de voz usando o modelo Kokoro-82M. Crie Kokoro TTS em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Kokoro TTS**: Wrapper FastAPI em Docker para síntese de voz usando o modelo Kokoro-82M. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kokoro-tts` |
| **Containers** | 1 (`kokoro-tts`) |
| **Porta da interface** | 8880, no serviço `kokoro-tts` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Kokoro TTS** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `device` | cpu |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DEVICE` | ${device} |
| `MODEL_PATH` | /app/models |
| `HOST` | 0.0.0.0 |
| `PORT` | 8880 |
| `PYTHONUNBUFFERED` | 1 |
| `UV_SYSTEM_PYTHON` | 1 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `kokoro-tts` | 8880 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `README.md`

## docker-compose.yml do template

```yaml
services:
  kokoro-tts:
    build:
      context: https://github.com/remsky/Kokoro-FastAPI.git#master
      dockerfile: docker/cpu/Dockerfile
    restart: unless-stopped
    ports:
      - 8880
    environment:
      - MODEL_PATH=/app/models
      - DEVICE=${DEVICE:-cpu}
      - HOST=0.0.0.0
      - PORT=8880
    volumes:
      - kokoro-models:/app/models
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8880/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
volumes:
  kokoro-models:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
