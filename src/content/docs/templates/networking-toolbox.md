---
title: Hospedar Networking Toolbox com Rustploy
description: "Painel web contendo dezenas de utilitários rápidos para testes de rede. Crie Networking Toolbox em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Networking Toolbox**: Painel web contendo dezenas de utilitários rápidos para testes de rede. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `networking-toolbox` |
| **Containers** | 1 (`app`) |
| **Imagens** | `lissy93/networking-toolbox:latest` |
| **Porta da interface** | 3000, no serviço `app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Networking Toolbox** e selecione.
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
| `NODE_ENV` | production |
| `PORT` | 3000 |
| `HOST` | 0.0.0.0 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `app` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  app:
    image: lissy93/networking-toolbox:latest
    expose:
      - "3000"
    environment:
      NODE_ENV: ${NODE_ENV}
      PORT: ${PORT}
      HOST: ${HOST}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
