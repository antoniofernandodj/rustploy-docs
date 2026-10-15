---
title: Hospedar MediaFetch com Rustploy
description: "Interface web simplificada para download de áudio/vídeo alimentada por yt-dlp. Crie MediaFetch em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**MediaFetch**: Interface web simplificada para download de áudio/vídeo alimentada por yt-dlp. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mediafetch` |
| **Containers** | 1 (`mediafetch`) |
| **Imagens** | `lukedunsmoto/mediafetch:latest` |
| **Porta da interface** | 3002, no serviço `mediafetch` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **MediaFetch** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `BASIC_AUTH_USER` | admin |
| `BASIC_AUTH_PASS` | *senha aleatória de 12 caracteres* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `mediafetch` | 3002 |  |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/data/downloads`

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  mediafetch:
    image: lukedunsmoto/mediafetch:latest
    restart: unless-stopped
    expose:
      - "3002"
    volumes:
      - mediafetch_data:/data/downloads
    environment:
      - PORT=3002
      - BASIC_AUTH_USER=${BASIC_AUTH_USER}
      - BASIC_AUTH_PASS=${BASIC_AUTH_PASS}
      - PUBLIC_BASE_URL=https://${DOMAIN}
      - OUTPUT_DIR=/data/downloads

volumes:
  mediafetch_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
