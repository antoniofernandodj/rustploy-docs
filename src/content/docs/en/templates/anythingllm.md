---
title: Host AnythingLLM with Rustploy
description: "Private chatbot to talk to your local documents. Create AnythingLLM in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**AnythingLLM**: Private chatbot to talk to your local documents. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `anythingllm` |
| **Containers** | 1 (`anythingllm`) |
| **Images** | `mintplexlabs/anythingllm:latest` |
| **UI port** | 3001, on service `anythingllm` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **AnythingLLM** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

## Domains

| Service | Port | Host |
|---|---|---|
| `anythingllm` | 3001 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"
services:
  anythingllm:
    image: mintplexlabs/anythingllm:latest
    restart: unless-stopped
    ports:
      - 3001
    environment:
      - STORAGE_DIR=/app/server/storage
    volumes:
      - storage:/app/server/storage
    cap_add:
      - SYS_ADMIN

volumes:
  storage: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
