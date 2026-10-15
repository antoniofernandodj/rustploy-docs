---
title: Hospedar Chromium com Rustploy
description: "Navegador open-source empacotado para execução em container. Crie Chromium em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Chromium**: Navegador open-source empacotado para execução em container. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `chromium` |
| **Containers** | 1 (`chromium`) |
| **Imagens** | `lscr.io/linuxserver/chromium:5f5dd27e-ls102` |
| **Porta da interface** | 3000, no serviço `chromium` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Chromium** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `chromium` | 3000 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  chromium:
    image: lscr.io/linuxserver/chromium:5f5dd27e-ls102
    ports:
      - "3000"
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=UTC
    volumes:
      - config:/config

volumes:
  config:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
