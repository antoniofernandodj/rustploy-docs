---
title: Hospedar StreamFlow com Rustploy
description: "Plataforma para retransmissão de fluxos de vídeo em tempo real (Restream) para múltiplos canais (YouTube/Facebook). Crie StreamFlow em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**StreamFlow**: Plataforma para retransmissão de fluxos de vídeo em tempo real (Restream) para múltiplos canais (YouTube/Facebook). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `streamflow` |
| **Containers** | 1 (`streamflow`) |
| **Porta da interface** | 7575, no serviço `streamflow` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **StreamFlow** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `session_secret` | *senha aleatória de 64 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SESSION_SECRET` | ${session_secret} |
| `TIMEZONE` | Asia/Jakarta |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `streamflow` | 7575 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  streamflow:
    build:
      context: https://github.com/bangtutorial/streamflow.git
    restart: unless-stopped
    environment:
      - PORT=7575
      - SESSION_SECRET=${SESSION_SECRET}
      - NODE_ENV=production
      - TZ=${TIMEZONE}
    volumes:
      - streamflow-db:/app/db
      - streamflow-logs:/app/logs
      - streamflow-uploads:/app/public/uploads
    ports:
      - 7575

volumes:
  streamflow-db: {}
  streamflow-logs: {}
  streamflow-uploads: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
