---
title: Hospedar Soketi com Rustploy
description: "Servidor WebSockets ultrarrápido construído em Node.js (Compatível com o ecossistema Laravel Pusher). Crie Soketi em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Soketi**: Servidor WebSockets ultrarrápido construído em Node.js (Compatível com o ecossistema Laravel Pusher). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `soketi` |
| **Containers** | 1 (`soketi`) |
| **Imagens** | `quay.io/soketi/soketi:1.6.1-16-debian` |
| **Porta da interface** | 6001, no serviço `soketi` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Soketi** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `metrics_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `soketi` | 6001 | ${main_domain} |
| `soketi` | 9601 | ${metrics_domain} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  soketi:
    image: quay.io/soketi/soketi:1.6.1-16-debian
    environment:
      SOKETI_DEBUG: "1"
      SOKETI_HOST: "0.0.0.0"
      SOKETI_PORT: "6001"
      SOKETI_METRICS_SERVER_PORT: "9601"
    restart: unless-stopped
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
