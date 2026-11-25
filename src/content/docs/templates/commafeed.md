---
title: Hospedar Commafeed com Rustploy
description: "Aplicação Commafeed. Crie Commafeed em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Commafeed**: Aplicação Commafeed. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `commafeed` |
| **Containers** | 1 (`commafeed`) |
| **Imagens** | `athou/commafeed:latest-h2` |
| **Porta da interface** | 8082, no serviço `commafeed` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Commafeed** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domínios**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `commafeed` | 8082 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  commafeed:
    image: athou/commafeed:latest-h2
    restart: unless-stopped
    volumes:
      - ../files/commafeed-data:/commafeed/data
    ports:
      - 8082
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
