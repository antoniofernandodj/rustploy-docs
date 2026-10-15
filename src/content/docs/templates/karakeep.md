---
title: Hospedar KaraKeep com Rustploy
description: "Rebrand do aplicativo de favoritos e anotações baseadas em IA (antigo Hoarder). Crie KaraKeep em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**KaraKeep**: Rebrand do aplicativo de favoritos e anotações baseadas em IA (antigo Hoarder). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `karakeep` |
| **Containers** | 3 (`web`, `chrome`, `meilisearch`) |
| **Imagens** | `ghcr.io/karakeep-app/karakeep:${KARAKEEP_VERSION:-release}`, `gcr.io/zenika-hub/alpine-chrome:124`, `getmeili/meilisearch:v1.13.3` |
| **Porta da interface** | 3000, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **KaraKeep** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `karakeep_version` | release |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `NEXTAUTH_URL` | http://${main_domain} |
| `MEILI_MASTER_KEY` | *senha aleatória de 36 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  web:
    image: ghcr.io/karakeep-app/karakeep:${KARAKEEP_VERSION:-release}
    restart: unless-stopped
    volumes:
      - data:/data
    environment:
      MEILI_ADDR: http://meilisearch:7700
      BROWSER_WEB_URL: http://chrome:9222
      DATA_DIR: /data
      NEXTAUTH_SECRET: your_secure_key
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
    image: getmeili/meilisearch:v1.13.3
    restart: unless-stopped
    environment:
      MEILI_NO_ANALYTICS: "true"
    volumes:
      - meilisearch:/meili_data

volumes:
  meilisearch:
  data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
