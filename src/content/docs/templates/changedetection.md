---
title: Hospedar Change Detection com Rustploy
description: "Monitor inteligente para detecção de alterações em páginas web. Crie Change Detection em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Change Detection**: Monitor inteligente para detecção de alterações em páginas web. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `changedetection` |
| **Containers** | 1 (`changedetection`) |
| **Imagens** | `ghcr.io/dgtlmoon/changedetection.io:0.49` |
| **Porta da interface** | 5000, no serviço `changedetection` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Change Detection** e selecione.
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
| `changedetection` | 5000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  changedetection:
    image: ghcr.io/dgtlmoon/changedetection.io:0.49
    restart: unless-stopped
    ports:
      - 5000
    volumes:
      - datastore:/datastore

volumes:
  datastore:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
