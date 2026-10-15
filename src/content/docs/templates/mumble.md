---
title: Hospedar Mumble com Rustploy
description: "Servidor de comunicação de voz com baixíssima latência voltado para jogos cooperativos. Crie Mumble em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Mumble**: Servidor de comunicação de voz com baixíssima latência voltado para jogos cooperativos. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `mumble` |
| **Containers** | 1 (`mumble-server`) |
| **Imagens** | `mumblevoip/mumble-server:latest` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Mumble** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `superuser_password` | *senha aleatória de 32 caracteres* |
| `welcome_text` | Welcome to Mumble Server! Low-latency voice chat. |
| `max_users` | 50 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SUPERUSER_PASSWORD` | ${superuser_password} |
| `WELCOME_TEXT` | ${welcome_text} |
| `MAX_USERS` | ${max_users} |

## docker-compose.yml do template

```yaml
services:
  mumble-server:
    image: mumblevoip/mumble-server:latest
    restart: unless-stopped
    ports:
      - 64738
      - 64738/udp
    volumes:
      - mumble-data:/data
    environment:
      - MUMBLE_SUPERUSER_PASSWORD=${SUPERUSER_PASSWORD}
      - MUMBLE_CONFIG_WELCOMETEXT=${WELCOME_TEXT}
      - MUMBLE_CONFIG_USERS=${MAX_USERS}

volumes:
  mumble-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
