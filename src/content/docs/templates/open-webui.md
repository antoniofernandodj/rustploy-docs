---
title: Hospedar Open WebUI com Rustploy
description: "Interface web completa para modelos LLM locais (Ollama) no estilo ChatGPT (inclui o Ollama). Crie Open WebUI em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Open WebUI**: Interface web completa para modelos LLM locais (Ollama) no estilo ChatGPT (inclui o Ollama). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `open-webui` |
| **Containers** | 1 (`open-webui`) |
| **Imagens** | `ghcr.io/open-webui/open-webui:main` |
| **Porta da interface** | 8080, no serviço `open-webui` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Open WebUI** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `webui_secret_key` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `webui_secret_key` | ${webui_secret_key} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `open-webui` | 8080 | ${main_domain} |

## docker-compose.yml do template

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

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
