---
title: Host Kokoro TTS with Rustploy
description: "FastAPI wrapper in Docker for speech synthesis with the Kokoro-82M model. Create Kokoro TTS in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Kokoro TTS**: FastAPI wrapper in Docker for speech synthesis with the Kokoro-82M model. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `kokoro-tts` |
| **Containers** | 1 (`kokoro-tts`) |
| **UI port** | 8880, on service `kokoro-tts` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Kokoro TTS** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `device` | cpu |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DEVICE` | ${device} |
| `MODEL_PATH` | /app/models |
| `HOST` | 0.0.0.0 |
| `PORT` | 8880 |
| `PYTHONUNBUFFERED` | 1 |
| `UV_SYSTEM_PYTHON` | 1 |

## Domains

| Service | Port | Host |
|---|---|---|
| `kokoro-tts` | 8880 | ${main_domain} |

## Configuration files

The template writes these files on the server and mounts them in the containers:

- `README.md`

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
