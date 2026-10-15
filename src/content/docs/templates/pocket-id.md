---
title: Hospedar Pocket ID com Rustploy
description: "Autenticador simples OIDC para proteger serviços usando passkeys nativas. Crie Pocket ID em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Pocket ID**: Autenticador simples OIDC para proteger serviços usando passkeys nativas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `pocket-id` |
| **Containers** | 1 (`pocket-id`) |
| **Imagens** | `ghcr.io/pocket-id/pocket-id:v1` |
| **Porta da interface** | 1411, no serviço `pocket-id` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Pocket ID** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ENCRYPTION_KEY` | CHANGEME: openssl rand -base64 32 |
| `APP_URL` | http://${main_domain} |
| `TRUST_PROXY` | true |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `pocket-id` | 1411 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  pocket-id:
    image: ghcr.io/pocket-id/pocket-id:v1
    restart: unless-stopped
    environment:
      - APP_URL
      - TRUST_PROXY
      - ENCRYPTION_KEY
    volumes:
      - pocket-id-data:/app/data
    healthcheck:
      test: [ "CMD", "/app/pocket-id", "healthcheck" ]
      interval: 1m30s
      timeout: 5s
      retries: 2
      start_period: 10s

volumes:
  pocket-id-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
