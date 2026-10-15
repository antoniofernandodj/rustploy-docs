---
title: Hospedar AllTube com Rustploy
description: "Interface web (GUI) para baixar vídeos usando youtube-dl. Crie AllTube em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**AllTube**: Interface web (GUI) para baixar vídeos usando youtube-dl. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `alltube` |
| **Containers** | 1 (`alltube`) |
| **Imagens** | `dnomd343/alltube:latest` |
| **Porta da interface** | 80, no serviço `alltube` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **AllTube** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `title` | My AllTube Site |
| `convert` | true |
| `stream` | true |
| `remux` | true |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TITLE` | ${title} |
| `CONVERT` | ${convert} |
| `STREAM` | ${stream} |
| `REMUX` | ${remux} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `alltube` | 80 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  alltube:
    image: dnomd343/alltube:latest
    restart: unless-stopped
    ports:
      - 80
    environment:
      - TITLE=${TITLE}
      - CONVERT=${CONVERT}
      - STREAM=${STREAM}
      - REMUX=${REMUX}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
