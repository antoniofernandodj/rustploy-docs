---
title: Host Anse with Rustploy
description: "Web interface for chatting with AI through the OpenAI-compatible API. Create Anse in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Anse**: Web interface for chatting with AI through the OpenAI-compatible API. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `anse` |
| **Containers** | 1 (`anse-demo`) |
| **Images** | `ddiu8081/anse:latest` |
| **UI port** | 3000, on service `anse-demo` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Anse** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `secret_key` | *random password, 32 characters* |
| `site_password` | *random password, 16 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `OPENAI_API_KEY` |  |
| `OPENAI_API_BASE_URL` | https://api.openai.com |
| `HEAD_SCRIPTS` |  |
| `SECRET_KEY` | ${secret_key} |
| `SITE_PASSWORD` | ${site_password} |
| `OPENAI_API_MODEL` | gpt-4o-mini |

## Domains

| Service | Port | Host |
|---|---|---|
| `anse-demo` | 3000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  anse-demo:
    image: ddiu8081/anse:latest
    restart: always
    expose:
      - 3000
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_API_BASE_URL=${OPENAI_API_BASE_URL}
      - HEAD_SCRIPTS=${HEAD_SCRIPTS}
      - SECRET_KEY=${SECRET_KEY}
      - SITE_PASSWORD=${SITE_PASSWORD}
      - OPENAI_API_MODEL=${OPENAI_API_MODEL}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
