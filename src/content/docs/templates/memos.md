---
title: Hospedar Memos com Rustploy
description: "Central de notas rápidas inspirada no Twitter, com foco em privacidade. Crie Memos em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Memos**: Central de notas rápidas inspirada no Twitter, com foco em privacidade. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `memos` |
| **Containers** | 1 (`memos`) |
| **Imagens** | `neosmemo/memos:stable` |
| **Porta da interface** | 5230, no serviço `memos` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Memos** e selecione.
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
| `MEMOS_MODE` | prod |
| `MEMOS_PORT` | 5230 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `memos` | 5230 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  memos:
    image: neosmemo/memos:stable
    restart: unless-stopped
    volumes:
      - memos_data:/var/opt/memos
    environment:
      - MEMOS_MODE=${MEMOS_MODE}
      - MEMOS_PORT=${MEMOS_PORT}
    ports:
      - "5230"
volumes:
  memos_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
