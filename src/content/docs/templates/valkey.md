---
title: Hospedar Valkey com Rustploy
description: "O fork oficial do Redis mantido pela Linux Foundation e grandes provedores de nuvem. Crie Valkey em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Valkey**: O fork oficial do Redis mantido pela Linux Foundation e grandes provedores de nuvem. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `valkey` |
| **Containers** | 1 (`valkey`) |
| **Imagens** | `valkey/valkey:8.1.4` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Valkey** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `valkey_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `VALKEY_PASSWORD` | ${valkey_password} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `valkey.conf`

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  valkey:
    image: valkey/valkey:8.1.4
    restart: unless-stopped
    ports:
      - 6379
    volumes:
      - ../files/valkey.conf:/etc/valkey/valkey.conf
      - valkey-data:/data
    command: valkey-server /etc/valkey/valkey.conf
    environment:
      - VALKEY_PASSWORD=${VALKEY_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "valkey-cli -a \"$$VALKEY_PASSWORD\" ping | grep PONG"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 10s

volumes:
  valkey-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
