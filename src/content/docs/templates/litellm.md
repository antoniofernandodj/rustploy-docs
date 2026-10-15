---
title: Hospedar LiteLLM com Rustploy
description: "Proxy leve que unifica as chamadas de múltiplos LLMs sob o padrão da API da OpenAI. Crie LiteLLM em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**LiteLLM**: Proxy leve que unifica as chamadas de múltiplos LLMs sob o padrão da API da OpenAI. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `litellm` |
| **Containers** | 2 (`litellm`, `litellm-db`) |
| **Imagens** | `ghcr.io/berriai/litellm:main-latest`, `postgres:16-alpine` |
| **Porta da interface** | 4000, no serviço `litellm` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **LiteLLM** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_db` | litellm |
| `postgres_user` | litellm |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `ui_username` | *usuário gerado* |
| `ui_password` | *senha aleatória de 32 caracteres* |
| `litellm_master_key` | *senha aleatória de 64 caracteres* |
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

**Entregues ao container:**

| Variável | Valor |
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

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `litellm` | 4000 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
