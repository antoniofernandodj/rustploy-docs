---
title: Hospedar Kokoro Web com Rustploy
description: "Interface de usuário amigável para geração de áudios via IA do Kokoro. Crie Kokoro Web em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Kokoro Web**: Interface de usuário amigável para geração de áudios via IA do Kokoro. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `kokoro-web` |
| **Containers** | 1 (`kokoro-web`) |
| **Imagens** | `ghcr.io/eduardolat/kokoro-web:latest` |
| **Porta da interface** | 3000, no serviço `kokoro-web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Kokoro Web** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_key` | *senha aleatória de 32 caracteres* |
| `no_track` | false |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `KW_SECRET_API_KEY` | ${api_key} |
| `KW_PUBLIC_NO_TRACK` | ${no_track} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `kokoro-web` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  kokoro-web:
    image: ghcr.io/eduardolat/kokoro-web:latest
    restart: unless-stopped
    environment:
      - KW_SECRET_API_KEY=${KW_SECRET_API_KEY}
      - KW_PUBLIC_NO_TRACK=${KW_PUBLIC_NO_TRACK}
    volumes:
      - kokoro-cache:/kokoro/cache

volumes:
  kokoro-cache: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
