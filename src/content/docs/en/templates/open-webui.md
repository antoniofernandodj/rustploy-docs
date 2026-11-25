---
title: Host Open WebUI with Rustploy
description: "Complete ChatGPT-style web interface for local LLM models (Ollama), including Ollama itself. Create Open WebUI in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Open WebUI**: Complete ChatGPT-style web interface for local LLM models (Ollama), including Ollama itself. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `open-webui` |
| **Containers** | 1 (`open-webui`) |
| **Images** | `ghcr.io/open-webui/open-webui:main` |
| **UI port** | 8080, on service `open-webui` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Open WebUI** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `webui_secret_key` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
|---|---|
| `webui_secret_key` | ${webui_secret_key} |

## Domains

| Service | Port | Host |
|---|---|---|
| `open-webui` | 8080 | ${main_domain} |

## The template docker-compose.yml

```yaml
# This is the main service for the Open WebUI interface.
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    restart: unless-stopped
    ports:
      - 8080
    environment:
      # This should point to your Ollama instance.
      # It defaults to the internal 'ollama' service if you uncomment it below.
      - "OLLAMA_BASE_URL=http://ollama:11434"
      # Secret key for session data encryption. It is configured in the template.toml.
      - "WEBUI_SECRET_KEY=${webui_secret_key}"
      # --------------------------------------------------------------------------
      # Optional: To enable web Browse via Playwright, uncomment the following
      # lines AND the 'playwright' service definition below.
      # - 'WEB_LOADER_ENGINE=playwright'
      # - 'PLAYWRIGHT_WS_URL=ws://playwright:3000'
      # --------------------------------------------------------------------------
      # Optional: To enable image generation, uncomment the following lines AND
      # the 'stable-diffusion-webui' service definition below.
      # - 'ENABLE_IMAGE_GENERATION=true'
      # - 'AUTOMATIC1111_BASE_URL=http://stable-diffusion-webui:7860'
      # --------------------------------------------------------------------------
    volumes:
      - open-webui:/app/backend/data
    # To use the internal Ollama and other optional services, uncomment the following 'depends_on' section.
    # Make sure to also uncomment the services you need below.
    # depends_on:
    #   - ollama
    #   - playwright
    #   - stable-diffusion-webui
    extra_hosts:
      - host.docker.internal:host-gateway

# -----------------------------------------------------------------------------------
# Optional: Ollama Service
# To enable local AI model hosting with Ollama, uncomment the following service.
# services:
#   ollama:
#     image: ollama/ollama:latest
#     restart: unless-stopped
#     volumes:
#       - ollama:/root/.ollama
#     # --------------------------------------------------------------------------
#     # Optional: GPU Support (Uncomment the following lines to enable)
#     # deploy:
#     #   resources:
#     #     reservations:
#     #       devices:
#     #         - driver: nvidia
#     #           count: 1
#     #           capabilities: [gpu]
#     # --------------------------------------------------------------------------

# -----------------------------------------------------------------------------------
# Optional: Playwright Service for Web Loader
# To enable the web loader feature in Open WebUI, uncomment this service.
# playwright:
#   image: mcr.microsoft.com/playwright:v1.49.1-noble
#   restart: unless-stopped
#   command: npx -y playwright@1.49.1 run-server --port 3000 --host 0.0.0.0
# -----------------------------------------------------------------------------------

# -----------------------------------------------------------------------------------
# Optional: Stable Diffusion Service for Image Generation
# To enable image generation, uncomment this service. (Note: AMD64/x86_64 only)
# stable-diffusion-webui:
#   platform: linux/amd64
#   image: ghcr.io/neggles/sd-webui-docker:latest
#   restart: unless-stopped
#   environment:
#     CLI_ARGS: "--api --use-cpu all --precision full --no-half --skip-torch-cuda-test --ckpt /empty.pt --do-not-download-clip --disable-nan-check --disable-opt-split-attention"
#   volumes:
#     # You might need to adjust this volume based on your setup.
#     - ./sd-empty.pt:/empty.pt
# -----------------------------------------------------------------------------------

volumes:
  open-webui: {}
  ollama: {}
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
