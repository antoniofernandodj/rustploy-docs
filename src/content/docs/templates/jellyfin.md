---
title: Hospedar Jellyfin com Rustploy
description: "Central de mídia e streaming de vídeo totalmente gratuita e open-source. Crie Jellyfin em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Jellyfin**: Central de mídia e streaming de vídeo totalmente gratuita e open-source. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `jellyfin` |
| **Containers** | 1 (`jellyfin`) |
| **Imagens** | `jellyfin/jellyfin:10` |
| **Porta da interface** | 8096, no serviço `jellyfin` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Jellyfin** e selecione.
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
| `JELLYFIN_HOST` | ${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `jellyfin` | 8096 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  jellyfin:
    image: jellyfin/jellyfin:10
    volumes:
      - config:/config
      - cache:/cache
      - media:/media
    restart: "unless-stopped"
    # Optional - alternative address used for autodiscovery
    environment:
      - JELLYFIN_PublishedServerUrl=http://${JELLYFIN_HOST}
    # Optional - may be necessary for docker healthcheck to pass if running in host network mode
    extra_hosts:
      - "host.docker.internal:host-gateway"
volumes:
  config:
  cache:
  media:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
