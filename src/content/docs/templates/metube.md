---
title: Hospedar MeTube com Rustploy
description: "Downloader web de vídeos do YouTube utilizando o motor do yt-dlp. Crie MeTube em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**MeTube**: Downloader web de vídeos do YouTube utilizando o motor do yt-dlp. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `metube` |
| **Containers** | 1 (`metube`) |
| **Imagens** | `ghcr.io/alexta69/metube` |
| **Porta da interface** | 8081, no serviço `metube` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **MeTube** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `UID` | 1000 |
| `GID` | 1000 |
| `UMASK` | 022 |
| `DEFAULT_THEME` | auto |
| `DOWNLOAD_DIR` | /downloads |
| `AUDIO_DOWNLOAD_DIR` | /downloads |
| `DOWNLOAD_DIRS_INDEXABLE` | false |
| `CUSTOM_DIRS` | true |
| `CREATE_CUSTOM_DIRS` | true |
| `CUSTOM_DIRS_EXCLUDE_REGEX` | (^\|/)[.@].*$ |
| `STATE_DIR` | /downloads/.metube |
| `TEMP_DIR` | /downloads |
| `DELETE_FILE_ON_TRASHCAN` | false |
| `URL_PREFIX` | / |
| `PUBLIC_HOST_URL` |  |
| `HTTPS` | false |
| `CERTFILE` |  |
| `KEYFILE` |  |
| `PUBLIC_HOST_AUDIO_URL` |  |
| `OUTPUT_TEMPLATE` | %(title)s.%(ext)s |
| `OUTPUT_TEMPLATE_CHAPTER` | %(title)s - %(section_number)s %(section_title)s.%(ext)s |
| `OUTPUT_TEMPLATE_PLAYLIST` | %(playlist_title)s/%(title)s.%(ext)s |
| `DEFAULT_OPTION_PLAYLIST_STRICT_MODE` | false |
| `DEFAULT_OPTION_PLAYLIST_ITEM_LIMIT` | 0 |
| `YTDL_OPTIONS` | {} |
| `YTDL_OPTIONS_FILE` |  |
| `ROBOTS_TXT` |  |
| `DOWNLOAD_MODE` | limited |
| `MAX_CONCURRENT_DOWNLOADS` | 3 |
| `LOGLEVEL` | INFO |
| `ENABLE_ACCESSLOG` | false |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `metube` | 8081 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  metube:
    image: ghcr.io/alexta69/metube
    restart: unless-stopped
    ports:
      - 8081
    volumes:
      - ../files/downloads:/downloads
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
