---
title: Hospedar Browserless com Rustploy
description: "Execução remota e headless do Chrome/Puppeteer em containers Docker. Crie Browserless em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Browserless**: Execução remota e headless do Chrome/Puppeteer em containers Docker. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `browserless` |
| **Containers** | 1 (`browserless`) |
| **Imagens** | `ghcr.io/browserless/chromium:latest` |
| **Porta da interface** | 3000, no serviço `browserless` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Browserless** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `browserless_token` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `BROWSERLESS_HOST` | ${main_domain} |
| `BROWSERLESS_TOKEN` | ${browserless_token} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `browserless` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  browserless:
    image: ghcr.io/browserless/chromium:latest
    environment:
      TOKEN: ${BROWSERLESS_TOKEN}
    expose:
      - 3000
    healthcheck:
      test:
        - CMD
        - curl
        - '-f'
        - 'http://127.0.0.1:3000/docs'
      interval: 2s
      timeout: 10s
      retries: 15
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
