---
title: Hospedar Statping-NG com Rustploy
description: "Monitor visual de uptime e integridade de páginas com dashboards elegantes de status. Crie Statping-NG em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Statping-NG**: Monitor visual de uptime e integridade de páginas com dashboards elegantes de status. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `statping-ng` |
| **Containers** | 1 (`statping-ng`) |
| **Imagens** | `adamboutcher/statping-ng:latest` |
| **Porta da interface** | 8080, no serviço `statping-ng` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Statping-NG** e selecione.
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
| `TZ` | UTC |
| `DB_CONN` | sqlite |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `statping-ng` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  statping-ng:
    image: adamboutcher/statping-ng:latest
    restart: unless-stopped
    environment:
      - TZ=${TZ}
      - DB_CONN=sqlite
    volumes:
      - ../files/statping-ng:/app
    ports:
      - 8080
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
