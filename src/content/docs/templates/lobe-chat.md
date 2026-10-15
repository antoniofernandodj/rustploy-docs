---
title: Hospedar Lobe Chat com Rustploy
description: "Framework de chat com IA moderno, modular e com suporte a plugins de voz. Crie Lobe Chat em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Lobe Chat**: Framework de chat com IA moderno, modular e com suporte a plugins de voz. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `lobe-chat` |
| **Containers** | 1 (`lobe-chat`) |
| **Imagens** | `lobehub/lobe-chat:v1.26.1` |
| **Porta da interface** | 3210, no serviço `lobe-chat` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Lobe Chat** e selecione.
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
| `lobe-chat` | 3210 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  lobe-chat:
    image: lobehub/lobe-chat:v1.26.1
    restart: always
    ports:
      - 3210
    environment:
      OPENAI_API_KEY: sk-xxxx
      OPENAI_PROXY_URL: https://api-proxy.com/v1
      ACCESS_CODE: lobe66
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
