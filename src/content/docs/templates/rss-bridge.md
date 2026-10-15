---
title: Hospedar RSS-Bridge com Rustploy
description: "Utilitário PHP focado em gerar feeds RSS estruturados de plataformas que não os possuem nativamente. Crie RSS-Bridge em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**RSS-Bridge**: Utilitário PHP focado em gerar feeds RSS estruturados de plataformas que não os possuem nativamente. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rss-bridge` |
| **Containers** | 1 (`rss-bridge`) |
| **Imagens** | `rssbridge/rss-bridge:latest` |
| **Porta da interface** | 80, no serviço `rss-bridge` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **RSS-Bridge** e selecione.
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
| `rss-bridge` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  rss-bridge:
    image: rssbridge/rss-bridge:latest
    restart: unless-stopped
    expose:
      - 80
    volumes:
      - rssbridge-config:/config

volumes:
  rssbridge-config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
