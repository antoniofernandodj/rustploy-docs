---
title: Host LiteLLM with Rustploy
description: "Lightweight proxy that unifies calls to multiple LLMs under the OpenAI API standard. Create LiteLLM in one click on Rustploy: 2 containers, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**LiteLLM**: Lightweight proxy that unifies calls to multiple LLMs under the OpenAI API standard. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `litellm` |
| **Containers** | 2 (`litellm`, `litellm-db`) |
| **Images** | `ghcr.io/berriai/litellm:main-latest`, `postgres:16-alpine` |
| **UI port** | 4000, on service `litellm` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **LiteLLM** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `postgres_db` | litellm |
| `postgres_user` | litellm |
| `postgres_password` | *random password, 32 characters* |
| `ui_username` | *generated username* |
| `ui_password` | *random password, 32 characters* |
| `litellm_master_key` | *random password, 64 characters* |
| `openai_api_key` |  |
| `openai_base_url` |  |
| `cohere_api_key` |  |
| `or_site_url` |  |
| `or_app_name` | LiteLLM Example app |
| `or_api_key` |  |
| `azure_api_base` |  |
| `azure_api_version` |  |
| `azure_api_key` |  |
| `replicate_api_key` |  |
| `replicate_api_token` |  |
| `anthropic_api_key` |  |
| `infisical_token` |  |
| `novita_api_key` |  |
| `infinity_api_key` |  |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `DATABASE_URL` | postgresql://${postgres_user}:${postgres_password}@litellm-db:5432/${postgres_db} |
| `POSTGRES_DB` | ${postgres_db} |
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `UI_USERNAME` | ${ui_username} |
| `UI_PASSWORD` | ${ui_password} |
| `LITELLM_MASTER_KEY` | ${litellm_master_key} |
| `STORE_MODEL_IN_DB` | True |
| `OPENAI_API_KEY` | ${openai_api_key} |
| `OPENAI_BASE_URL` | ${openai_base_url} |
| `COHERE_API_KEY` | ${cohere_api_key} |
| `OR_SITE_URL` | ${or_site_url} |
| `OR_APP_NAME` | ${or_app_name} |
| `OR_API_KEY` | ${or_api_key} |
| `AZURE_API_BASE` | ${azure_api_base} |
| `AZURE_API_VERSION` | ${azure_api_version} |
| `AZURE_API_KEY` | ${azure_api_key} |
| `REPLICATE_API_KEY` | ${replicate_api_key} |
| `REPLICATE_API_TOKEN` | ${replicate_api_token} |
| `ANTHROPIC_API_KEY` | ${anthropic_api_key} |
| `INFISICAL_TOKEN` | ${infisical_token} |
| `NOVITA_API_KEY` | ${novita_api_key} |
| `INFINITY_API_KEY` | ${infinity_api_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `litellm` | 4000 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3.8"

services:
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    restart: unless-stopped
    depends_on:
      litellm-db:
        condition: service_healthy
    environment:
      DATABASE_URL: ${DATABASE_URL}
      LITELLM_MASTER_KEY: ${LITELLM_MASTER_KEY}
      UI_USERNAME: ${UI_USERNAME}
      UI_PASSWORD: ${UI_PASSWORD}
      STORE_MODEL_IN_DB: "True"

      # Provider Keys
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      OPENAI_BASE_URL: ${OPENAI_BASE_URL}
      COHERE_API_KEY: ${COHERE_API_KEY}
      OR_SITE_URL: ${OR_SITE_URL}
      OR_APP_NAME: ${OR_APP_NAME}
      OR_API_KEY: ${OR_API_KEY}
      AZURE_API_BASE: ${AZURE_API_BASE}
      AZURE_API_VERSION: ${AZURE_API_VERSION}
      AZURE_API_KEY: ${AZURE_API_KEY}
      REPLICATE_API_KEY: ${REPLICATE_API_KEY}
      REPLICATE_API_TOKEN: ${REPLICATE_API_TOKEN}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      INFISICAL_TOKEN: ${INFISICAL_TOKEN}
      NOVITA_API_KEY: ${NOVITA_API_KEY}
      INFINITY_API_KEY: ${INFINITY_API_KEY}

    expose:
      - 4000

  litellm-db:
    image: postgres:16-alpine
    restart: on-failure:5
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - litellm-db:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

volumes:
  litellm-db: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
