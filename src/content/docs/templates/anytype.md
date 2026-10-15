---
title: Hospedar Anytype com Rustploy
description: "Base de conhecimento pessoal \"offline-first\" e criptografada. Crie Anytype em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Anytype**: Base de conhecimento pessoal "offline-first" e criptografada. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `anytype` |
| **Containers** | 1 (`any-sync-bundle`) |
| **Imagens** | `ghcr.io/grishy/any-sync-bundle:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Anytype** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## docker-compose.yml do template

```yaml
# Example: Any-Sync-Bundle with embedded MongoDB and Redis (all-in-one image)
#
# Usage:
#   docker compose -f compose.aio.yml up -d
#
# The bundle image already contains MongoDB and Redis. Only the bundle service is required

services:
  any-sync-bundle:
    image: ghcr.io/grishy/any-sync-bundle:latest
    restart: unless-stopped
    ports:
      - "33010:33010"
      - "33020:33020/udp"
    volumes:
      - ./data:/data
    environment:
      # Advertise addresses clients should use. Replace with your server hostname/IP.
      ANY_SYNC_BUNDLE_INIT_EXTERNAL_ADDRS: "192.168.100.9"
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
