---
title: Hospedar Hoarder com Rustploy
description: "Aplicativo inteligente de bookmarks com auto-tagging baseado em IA. Crie Hoarder em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Hoarder**: Aplicativo inteligente de bookmarks com auto-tagging baseado em IA. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `hoarder` |
| **Containers** | 3 (`web`, `chrome`, `meilisearch`) |
| **Imagens** | `ghcr.io/hoarder-app/hoarder:0.22.0`, `gcr.io/zenika-hub/alpine-chrome:124`, `getmeili/meilisearch:v1.6` |
| **Porta da interface** | 3000, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Hoarder** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `next_secret` | *chave base64 aleatória (32 bytes)* |
| `meili_master_key` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NEXTAUTH_SECRET` | ${next_secret} |
| `MEILI_MASTER_KEY` | ${meili_master_key} |
| `NEXTAUTH_URL` | http://${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  web:
    image: ghcr.io/hoarder-app/hoarder:0.22.0
    restart: unless-stopped
    volumes:
      - hoarder-data:/data
    ports:
      - 3000
    environment:
      - DISABLE_SIGNUPS
      - NEXTAUTH_URL
      - NEXTAUTH_SECRET
      - MEILI_ADDR=http://meilisearch:7700
      - BROWSER_WEB_URL=http://chrome:9222
      - DATA_DIR=/data
      - MEILI_MASTER_KEY
  chrome:
    image: gcr.io/zenika-hub/alpine-chrome:124
    restart: unless-stopped
    command:
      - --no-sandbox
      - --disable-gpu
      - --disable-dev-shm-usage
      - --remote-debugging-address=0.0.0.0
      - --remote-debugging-port=9222
      - --hide-scrollbars
  meilisearch:
    image: getmeili/meilisearch:v1.6
    restart: unless-stopped
    environment:
      - MEILI_MASTER_KEY
      - MEILI_NO_ANALYTICS=true
    volumes:
      - meilisearch-data:/meili_data
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://127.0.0.1:7700/health'
      interval: 2s
      timeout: 10s
      retries: 15
volumes:
  meilisearch-data:
  hoarder-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
