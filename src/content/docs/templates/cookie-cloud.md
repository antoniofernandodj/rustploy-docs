---
title: Hospedar CookieCloud com Rustploy
description: "Sincronizador criptografado de cookies de navegadores entre dispositivos. Crie CookieCloud em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**CookieCloud**: Sincronizador criptografado de cookies de navegadores entre dispositivos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cookie-cloud` |
| **Containers** | 1 (`cookiecloud`) |
| **Imagens** | `easychen/cookiecloud:latest` |
| **Porta da interface** | 8088, no serviço `cookiecloud` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **CookieCloud** e selecione.
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
| `cookiecloud` | 8088 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  cookiecloud:
    image: easychen/cookiecloud:latest
    restart: unless-stopped
    expose:
      - 8088
    volumes:
      - cookiecloud-data:/data/api/data
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8088"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  cookiecloud-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
