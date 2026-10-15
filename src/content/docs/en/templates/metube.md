---
title: Host MeTube with Rustploy
description: "Web downloader for YouTube videos using the yt-dlp engine. Create MeTube in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**MeTube**: Web downloader for YouTube videos using the yt-dlp engine. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `metube` |
| **Containers** | 1 (`metube`) |
| **Images** | `ghcr.io/alexta69/metube` |
| **UI port** | 8081, on service `metube` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **MeTube** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |

**Delivered to the container:**

| Variable | Value |
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

## Domains

| Service | Port | Host |
|---|---|---|
| `metube` | 8081 | ${main_domain} |

## The template docker-compose.yml

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

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
