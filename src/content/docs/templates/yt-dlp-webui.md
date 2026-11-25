---
title: Hospedar Yt Dlp Webui com Rustploy
description: "Aplicação Yt Dlp Webui. Crie Yt Dlp Webui em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Yt Dlp Webui**: Aplicação Yt Dlp Webui. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `yt-dlp-webui` |
| **Containers** | 1 (`yt-dlp-webui`) |
| **Imagens** | `marcobaobao/yt-dlp-webui` |
| **Porta da interface** | 3033, no serviço `yt-dlp-webui` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Yt Dlp Webui** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domínios**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `yt-dlp-webui` | 3033 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  yt-dlp-webui:
    image: marcobaobao/yt-dlp-webui
    ports:
      - 3033
    volumes:
      - downloads:/downloads
      - config:/config
    healthcheck:
      test: curl -f http://localhost:3033 || exit 1
    restart: unless-stopped

volumes:
  downloads: {}
  config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
