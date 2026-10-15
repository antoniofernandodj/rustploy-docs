---
title: Hospedar Syncthing com Rustploy
description: "Sincronizador contínuo e descentralizado de diretórios entre múltiplos computadores em tempo real. Crie Syncthing em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Syncthing**: Sincronizador contínuo e descentralizado de diretórios entre múltiplos computadores em tempo real. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `syncthing` |
| **Containers** | 1 (`syncthing`) |
| **Imagens** | `lscr.io/linuxserver/syncthing:latest` |
| **Porta da interface** | 8384, no serviço `syncthing` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Syncthing** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `timezone` | America/Sao_Paulo |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `syncthing` | 8384 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  syncthing:
    image: lscr.io/linuxserver/syncthing:latest
    restart: unless-stopped
    expose:
      - 8384
      - 22000
      - 21027/udp
    volumes:
      - syncthing_config:/config
      - syncthing_data:/var/syncthing/Sync
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=${timezone}

volumes:
  syncthing_config:
  syncthing_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
