---
title: Hospedar Verdaccio com Rustploy
description: "Servidor proxy local e privado para repositórios e pacotes Node.js (npm). Crie Verdaccio em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Verdaccio**: Servidor proxy local e privado para repositórios e pacotes Node.js (npm). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `verdaccio` |
| **Containers** | 1 (`verdaccio`) |
| **Imagens** | `verdaccio/verdaccio:6` |
| **Porta da interface** | 4873, no serviço `verdaccio` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Verdaccio** e selecione.
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
| `verdaccio` | 4873 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/conf/config.yaml`

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  verdaccio:
    image: verdaccio/verdaccio:6
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - 4873
    volumes:
      - verdaccio_storage:/verdaccio/storage
      - verdaccio_plugins:/verdaccio/plugins
      - ../files/conf:/verdaccio/conf

volumes:
  verdaccio_storage:
  verdaccio_plugins:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
