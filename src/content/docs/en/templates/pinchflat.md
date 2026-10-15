---
title: Host Pinchflat with Rustploy
description: "Interface to download and automate downloading entire YouTube channels via yt-dlp. Create Pinchflat in one click on Rustploy: 1 container, generated variables, domain and automatic HTTPS."
sidebar:
  hidden: true
---

**Pinchflat**: Interface to download and automate downloading entire YouTube channels via yt-dlp. Rustploy ships a ready-made template: you pick it, adjust the domain and deploy.

## Summary

| | |
|---|---|
| **Identifier** | `pinchflat` |
| **Containers** | 1 (`pinchflat`) |
| **Images** | `ghcr.io/kieraneglin/pinchflat:latest` |
| **UI port** | 8945, on service `pinchflat` |
| **Type in Rustploy** | Compose stack |

## How to create it

1. In the project, click **+ Novo serviço → Template** (New service → Template).
2. Search for **Pinchflat** and select it.
3. Name the service and review the variables. Passwords and keys come already generated.
4. Create it and run **Deploy**.
5. Point your domain in **Domains**. See [Domains and HTTPS](/en/guias/dominios-e-tls/).

## Environment variables

**Template variables** (values computed at creation):

| Variable | Value |
|---|---|
| `main_domain` | *domain (generated; replace it with yours)* |
| `basic_auth_password` | *random password, 32 characters* |

**Delivered to the container:**

| Variable | Value |
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

## Domains

| Service | Port | Host |
|---|---|---|
| `pinchflat` | 8945 | ${main_domain} |

## The template docker-compose.yml

```yaml
version: "3"
services:
  pinchflat:
    image: ghcr.io/kieraneglin/pinchflat:latest
    volumes:
      - ../files/config:/config
      - ../files/downloads:/downloads
```

## See also

- [One-click templates](/en/guias/templates/)
- [Docker Compose stacks](/en/guias/compose/)
- [Diagnosing a 502](/en/guias/diagnosticar-502/)
