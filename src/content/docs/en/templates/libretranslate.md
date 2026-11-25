---
title: Host LibreTranslate with Rustploy
description: "Self-hosted machine translation API with no external dependencies. Create LibreTranslate in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**LibreTranslate**: Self-hosted machine translation API with no external dependencies. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `libretranslate` |
| **Containers** | 1 (`libretranslate`) |
| **Images** | `libretranslate/libretranslate:latest` |
| **UI port** | 5000, on service `libretranslate` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **LibreTranslate** and select it.
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
| `libretranslate` | 5000 | ${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
