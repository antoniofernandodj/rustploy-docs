---
title: Hospedar Tor Browser com Rustploy
description: "Instância do navegador Tor acessível diretamente via interface web baseada em VNC (noVNC). Crie Tor Browser em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Tor Browser**: Instância do navegador Tor acessível diretamente via interface web baseada em VNC (noVNC). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `tor-browser` |
| **Containers** | 1 (`tor`) |
| **Imagens** | `domistyle/tor-browser` |
| **Porta da interface** | 5800, no serviço `tor` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Tor Browser** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `display_width` | 1920 |
| `display_height` | 1080 |
| `keep_app_running` | 1 |
| `timezone` | Europe/Vienna |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DISPLAY_WIDTH` | ${display_width} |
| `DISPLAY_HEIGHT` | ${display_height} |
| `KEEP_APP_RUNNING` | ${keep_app_running} |
| `TZ` | ${timezone} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `tor` | 5800 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.9"

services:
  tor:
    image: domistyle/tor-browser
    restart: always
    expose:
      - 5800
      - 5900
    environment:
      DISPLAY_WIDTH: ${DISPLAY_WIDTH}
      DISPLAY_HEIGHT: ${DISPLAY_HEIGHT}
      KEEP_APP_RUNNING: ${KEEP_APP_RUNNING}
      TZ: ${TZ}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
