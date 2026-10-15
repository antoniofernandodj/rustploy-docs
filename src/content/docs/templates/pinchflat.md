---
title: Hospedar Pinchflat com Rustploy
description: "Interface para baixar e automatizar o download de canais inteiros do YouTube via yt-dlp. Crie Pinchflat em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Pinchflat**: Interface para baixar e automatizar o download de canais inteiros do YouTube via yt-dlp. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `pinchflat` |
| **Containers** | 1 (`pinchflat`) |
| **Imagens** | `ghcr.io/kieraneglin/pinchflat:latest` |
| **Porta da interface** | 8945, no serviço `pinchflat` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Pinchflat** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `basic_auth_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TZ` | America/New_York |
| `LOG_LEVEL` | debug |
| `UMASK` | 022 |
| `BASIC_AUTH_USERNAME` |  |
| `BASIC_AUTH_PASSWORD` | ${basic_auth_password} |
| `EXPOSE_FEED_ENDPOINTS` | false |
| `ENABLE_IPV6` | false |
| `JOURNAL_MODE` | wal |
| `TZ_DATA_DIR` | /etc/elixir_tzdata_data |
| `BASE_ROUTE_PATH` | / |
| `YT_DLP_WORKER_CONCURRENCY` | 2 |
| `ENABLE_PROMETHEUS` | false |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `pinchflat` | 8945 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3"
services:
  pinchflat:
    image: ghcr.io/kieraneglin/pinchflat:latest
    volumes:
      - ../files/config:/config
      - ../files/downloads:/downloads
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
