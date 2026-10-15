---
title: Hospedar Openinary com Rustploy
description: "Alternativa de código aberto ao Cloudinary para processamento dinâmico de mídia. Crie Openinary em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Openinary**: Alternativa de código aberto ao Cloudinary para processamento dinâmico de mídia. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `openinary` |
| **Containers** | 1 (`openinary`) |
| **Imagens** | `openinary/openinary:${IMAGE_TAG:-latest}` |
| **Porta da interface** | 3000, no serviço `openinary` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Openinary** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `image_tag` | latest |
| `better_auth_secret` | *senha aleatória de 64 caracteres* |
| `better_auth_url` | http://${main_domain} |
| `allowed_origin` | http://${main_domain} |
| `next_public_api_base_url` | /api |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `IMAGE_TAG` | ${image_tag} |
| `BETTER_AUTH_SECRET` | ${better_auth_secret} |
| `BETTER_AUTH_URL` | ${better_auth_url} |
| `ALLOWED_ORIGIN` | ${allowed_origin} |
| `NEXT_PUBLIC_API_BASE_URL` | ${next_public_api_base_url} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `openinary` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  openinary:
    image: openinary/openinary:${IMAGE_TAG:-latest}
    pull_policy: always
    restart: unless-stopped
    expose:
      - 3000
    environment:
      NODE_ENV: production
      MODE: fullstack
      NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:-/api}
      BETTER_AUTH_SECRET: ${BETTER_AUTH_SECRET}
      BETTER_AUTH_URL: ${BETTER_AUTH_URL}
      ALLOWED_ORIGIN: ${ALLOWED_ORIGIN:-http://${domain}}
      DOCKER_CONTAINER: "true"
    volumes:
      - cache-data:/app/apps/api/cache
      - public-files:/app/apps/api/public
      - db-data:/app/data
      - db-data:/app/web-standalone/data

volumes:
  cache-data:
  public-files:
  db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
