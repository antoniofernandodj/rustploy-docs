---
title: Hospedar ruTorrent com Rustploy
description: "Interface clássica web robusta acoplada ao cliente estável de torrent rTorrent. Crie ruTorrent em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ruTorrent**: Interface clássica web robusta acoplada ao cliente estável de torrent rTorrent. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rutorrent` |
| **Containers** | 1 (`rutorrent`) |
| **Imagens** | `crazymax/rtorrent-rutorrent:latest` |
| **Porta da interface** | 8080, no serviço `rutorrent` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ruTorrent** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `puid` | ${PUID:-1000} |
| `pgid` | ${PGID:-1000} |
| `incoming_port` | ${INCOMING_PORT:-50000} |
| `dht_port` | ${DHT_PORT:-6881} |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PUID` | ${puid} |
| `PGID` | ${pgid} |
| `INCOMING_PORT` | ${incoming_port} |
| `DHT_PORT` | ${dht_port} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `rutorrent` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  rutorrent:
    image: crazymax/rtorrent-rutorrent:latest
    restart: unless-stopped
    environment:
      - PUID=${PUID:-1000}
      - PGID=${PGID:-1000}
      # Optional: keep defaults, Dokploy will route 8080 via domain
      - RUTORRENT_PORT=8080
      - XMLRPC_PORT=8000
      # You can customize these if you like:
      - RT_DHT_PORT=${DHT_PORT:-6881}
      - RT_INC_PORT=${INCOMING_PORT:-50000}
    volumes:
      - rutorrent-data:/data
      - rutorrent-downloads:/downloads
      - rutorrent-passwd:/passwd
    # Expose only P2P-related ports; Dokploy domain will handle the web UI.
    ports:
      - "${INCOMING_PORT:-50000}:50000/tcp"
      - "${DHT_PORT:-6881}:6881/udp"

volumes:
  rutorrent-data: {}
  rutorrent-downloads: {}
  rutorrent-passwd: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
