---
title: Hospedar LibreTranslate com Rustploy
description: "API auto-hospedada de tradução de idiomas por máquina sem dependências externas. Crie LibreTranslate em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**LibreTranslate**: API auto-hospedada de tradução de idiomas por máquina sem dependências externas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `libretranslate` |
| **Containers** | 1 (`libretranslate`) |
| **Imagens** | `libretranslate/libretranslate:latest` |
| **Porta da interface** | 5000, no serviço `libretranslate` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **LibreTranslate** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `libretranslate` | 5000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  libretranslate:
    image: libretranslate/libretranslate:latest
    restart: unless-stopped
    ports:
      - "5000"
    environment:
      # Enables the API key system
      - LT_API_KEYS=true
      # Defines the path for the API keys database INSIDE the container
      - LT_API_KEYS_DB_PATH=/app/db/api_keys.db
      # Optional: Load only the languages you need to save RAM (Spanish, English, Chinese)
      # - LT_LOAD_ONLY=en,es,zh-Hans
      # This ensures the API is not public and does not accept requests when api_key is ""
      # - LT_REQ_LIMIT=0
      # This disables the web UI so it doesn’t show on the link
      # - LT_DISABLE_WEB_UI=true
      # This only allows requests from a specific origin page
      # - LT_REQUIRE_API_KEY_ORIGIN=webthat.canuse.translate.com
    volumes:
      # Volume to store downloaded language models
      - libretranslate_models:/home/libretranslate/.local
      # Volume to store the API keys database
      - libretranslate_api_keys:/app/db

volumes:
  libretranslate_models:
  libretranslate_api_keys:
  # TO GET AN API KEY YOU MUST GO TO THE TERMINAL AND RUN -> ltmanage keys add 1000000
  # To make it work only with an API key, you need to use LT_REQ_LIMIT=0 so it isn’t open to other users
  # For more information, see https://docs.libretranslate.com/guides/manage_api_keys/
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
