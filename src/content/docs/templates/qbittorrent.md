---
title: Hospedar qBittorrent com Rustploy
description: "Cliente de BitTorrent clássico equipado com sua interface web nativa de gerenciamento. Crie qBittorrent em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**qBittorrent**: Cliente de BitTorrent clássico equipado com sua interface web nativa de gerenciamento. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `qbittorrent` |
| **Containers** | 1 (`qbittorrent`) |
| **Imagens** | `lscr.io/linuxserver/qbittorrent:latest` |
| **Porta da interface** | 8080, no serviço `qbittorrent` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **qBittorrent** e selecione.
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
| `qbittorrent` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
# docker-compose.yml
# 
# IMPORTANT: First-time setup information
# - Default username: admin
# - Password: Check container logs for temporary password on first startup
# - Access via your configured domain (HTTPS) after deployment
# - Change the default password immediately after first login
#
services:
  qbittorrent:
    image: lscr.io/linuxserver/qbittorrent:latest
    restart: unless-stopped
    environment:
      - PUID=1000
      - PGID=1000
      - WEBUI_PORT=8080
      - TORRENTING_PORT=6881
    volumes:
      - qb_config:/config
      - qb_downloads:/downloads
    ports:
      - 8080
      - 6881:6881
      - 6881:6881/udp
    labels:
      - "traefik.enable=true"
volumes:
  qb_config:
  qb_downloads:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
