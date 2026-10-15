---
title: Hospedar Navidrome com Rustploy
description: "Servidor leve de streaming de áudio compatível com o protocolo Subsonic. Crie Navidrome em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Navidrome**: Servidor leve de streaming de áudio compatível com o protocolo Subsonic. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `navidrome` |
| **Containers** | 1 (`navidrome`) |
| **Imagens** | `deluan/navidrome:latest` |
| **Porta da interface** | 4533, no serviço `navidrome` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Navidrome** e selecione.
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
| `navidrome` | 4533 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  navidrome:
    image: deluan/navidrome:latest
    restart: unless-stopped
    environment:
      - ND_SCANSCHEDULE=1h
      - ND_LOGLEVEL=info
      - ND_SESSIONTIMEOUT=24h
    volumes:
      - navidrome-data:/data
      - navidrome-music:/music:ro
    ports:
      - 4533

volumes:
  navidrome-data: {}
  navidrome-music: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
