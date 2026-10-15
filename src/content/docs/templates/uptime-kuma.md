---
title: Hospedar Uptime Kuma com Rustploy
description: "Monitor visual de uptime de serviços e portas de rede com alertas via Telegram/Discord. Crie Uptime Kuma em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Uptime Kuma**: Monitor visual de uptime de serviços e portas de rede com alertas via Telegram/Discord. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `uptime-kuma` |
| **Containers** | 1 (`uptime-kuma`) |
| **Imagens** | `louislam/uptime-kuma:2.1.0` |
| **Porta da interface** | 3001, no serviço `uptime-kuma` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Uptime Kuma** e selecione.
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
| `uptime-kuma` | 3001 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2.1.0
    restart: always
    volumes:
      - uptime-kuma-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  uptime-kuma-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
