---
title: Hospedar Audiobookshelf com Rustploy
description: "Servidor de mídia exclusivo para audiolivros e podcasts. Crie Audiobookshelf em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Audiobookshelf**: Servidor de mídia exclusivo para audiolivros e podcasts. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `audiobookshelf` |
| **Containers** | 1 (`audiobookshelf`) |
| **Imagens** | `ghcr.io/advplyr/audiobookshelf:2.19.4` |
| **Porta da interface** | 80, no serviço `audiobookshelf` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Audiobookshelf** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `audiobooks_path` | /path/to/your/audiobooks |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `AUDIOBOOKS_PATH` | ${audiobooks_path} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `audiobookshelf` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  audiobookshelf:
    image: ghcr.io/advplyr/audiobookshelf:2.19.4
    restart: unless-stopped
    ports:
      - 80
    environment:
      - TZ=UTC
    volumes:
      - config:/config
      - metadata:/metadata
      - ${AUDIOBOOKS_PATH}:/audiobooks

volumes:
  config: {}
  metadata: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
