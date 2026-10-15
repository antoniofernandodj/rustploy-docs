---
title: Hospedar Emby com Rustploy
description: "Servidor de mídia privado para streaming de filmes, séries e músicas. Crie Emby em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Emby**: Servidor de mídia privado para streaming de filmes, séries e músicas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `emby` |
| **Containers** | 1 (`emby`) |
| **Imagens** | `emby/embyserver` |
| **Porta da interface** | 8096, no serviço `emby` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Emby** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `emby` | 8096 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "2.3"
services:
  emby:
    image: emby/embyserver
    # Uncomment to enable DLNA and Wake-on-Lan
    # network_mode: host
    environment:
      - UID=1000 # The UID to run emby as (default: 2)
      - GID=100 # The GID to run emby as (default 2)
      - GIDLIST=100 # A comma-separated list of additional GIDs to run emby as (default: 2)
    volumes:
      - /emby/programdata:/config # Configuration directory
      - /emby/series:/mnt/share1 # Media directory
      - /emby/movies:/mnt/share2 # Media directory
    ports:
      - 8096 # HTTP port
      - 8920 # HTTPS port
    devices:
      - /dev/dri:/dev/dri # VAAPI/NVDEC/NVENC render nodes
    restart: on-failure
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
