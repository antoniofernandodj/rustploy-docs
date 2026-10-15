---
title: Hospedar Bazarr com Rustploy
description: "Gerenciador automático de legendas integrado ao Sonarr/Radarr. Crie Bazarr em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Bazarr**: Gerenciador automático de legendas integrado ao Sonarr/Radarr. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bazarr` |
| **Containers** | 1 (`bazarr`) |
| **Imagens** | `lscr.io/linuxserver/bazarr:1.5.1` |
| **Porta da interface** | 6767, no serviço `bazarr` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Bazarr** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `movies_path` | /path/to/movies |
| `tv_path` | /path/to/tv |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MOVIES_PATH` | ${movies_path} |
| `TV_PATH` | ${tv_path} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `bazarr` | 6767 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  bazarr:
    image: lscr.io/linuxserver/bazarr:1.5.1
    restart: unless-stopped
    ports:
      - 6767
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
    volumes:
      - config:/config
      - ${MOVIES_PATH}:/movies
      - ${TV_PATH}:/tv

volumes:
  config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
