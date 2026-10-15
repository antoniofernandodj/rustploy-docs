---
title: Hospedar Apprise API com Rustploy
description: "API universal para envio de notificações para dezenas de serviços. Crie Apprise API em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Apprise API**: API universal para envio de notificações para dezenas de serviços. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `apprise-api` |
| **Containers** | 1 (`apprise-api`) |
| **Imagens** | `linuxserver/apprise-api:latest` |
| **Porta da interface** | 8000, no serviço `apprise-api` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Apprise API** e selecione.
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
| `apprise-api` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  apprise-api:
    image: linuxserver/apprise-api:latest
    restart: unless-stopped
    ports:
      - 8000
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
    volumes:
      - config:/config

volumes:
  config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
