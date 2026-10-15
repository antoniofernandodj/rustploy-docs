---
title: Hospedar Typesense com Rustploy
description: "Motor de busca rápida e tolerante a falhas feito para buscas em tempo real em aplicações. Crie Typesense em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Typesense**: Motor de busca rápida e tolerante a falhas feito para buscas em tempo real em aplicações. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `typesense` |
| **Containers** | 1 (`typesense`) |
| **Imagens** | `typesense/typesense:29.0` |
| **Porta da interface** | 8108, no serviço `typesense` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Typesense** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_key` | *senha aleatória de 16 caracteres* |
| `enable_cors` | true |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TYPESENSE_API_KEY` | ${api_key} |
| `TYPESENSE_ENABLE_CORS` | ${enable_cors} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `typesense` | 8108 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  typesense:
    image: typesense/typesense:29.0
    restart: unless-stopped
    environment:
      - TYPESENSE_API_KEY=${TYPESENSE_API_KEY}
      - TYPESENSE_ENABLE_CORS=${TYPESENSE_ENABLE_CORS}
      - TYPESENSE_DATA_DIR=/data
    volumes:
      - typesense-data:/data

volumes:
  typesense-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
