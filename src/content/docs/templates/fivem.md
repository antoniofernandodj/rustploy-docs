---
title: Hospedar Fivem com Rustploy
description: "Aplicação Fivem. Crie Fivem em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Fivem**: Aplicação Fivem. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `fivem` |
| **Containers** | 1 (`fivem`) |
| **Imagens** | `spritsail/fivem:latest` |
| **Porta da interface** | 40120, no serviço `fivem` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Fivem** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `license_key` | *senha aleatória de 32 caracteres* |
| `rcon_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LICENSE_KEY` | ${license_key} |
| `RCON_PASSWORD` | ${rcon_password} |
| `NO_DEFAULT_CONFIG` | ${NO_DEFAULT_CONFIG:-} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `fivem` | 40120 | ${main_domain} |

## docker-compose.yml do template

```yaml
# docker-compose.yml
# 
# IMPORTANT: FiveM Template - Two Deployment Modes
# 
# MODE 1: Standard FiveM Server
# - Set LICENSE_KEY environment variable (get free from https://forum.fivem.net/)
# - Leave NO_DEFAULT_CONFIG empty or unset
# - Server configured via /config files
# - No web management interface
#
# MODE 2: txAdmin Web Interface  
# - Set NO_DEFAULT_CONFIG=1
# - DO NOT set LICENSE_KEY (configure via web UI)
# - Access web management at https://your-domain
# - License configured through txAdmin interface
#
# WARNING: Don't mix modes! Setting both LICENSE_KEY and NO_DEFAULT_CONFIG=1 causes errors
#
services:
  fivem:
    image: spritsail/fivem:latest
    restart: unless-stopped
    tty: true
    stdin_open: true
    environment:
      - LICENSE_KEY=${license_key}
      - RCON_PASSWORD=${rcon_password}
      - NO_DEFAULT_CONFIG=${NO_DEFAULT_CONFIG:-}
    volumes:
      - fivem_config:/config
      - fivem_txdata:/txData
    ports:
      - 30120:30120
      - 30120:30120/udp
      - 40120
    labels:
      - "traefik.enable=true"

volumes:
  fivem_config:
  fivem_txdata:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
