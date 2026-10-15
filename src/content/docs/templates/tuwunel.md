---
title: Hospedar Tuwunel com Rustploy
description: "Servidor Matrix de alta performance em Rust (Sucessor oficial do Conduwuit para ambientes corporativos). Crie Tuwunel em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Tuwunel**: Servidor Matrix de alta performance em Rust (Sucessor oficial do Conduwuit para ambientes corporativos). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `tuwunel` |
| **Containers** | 1 (`tuwunel`) |
| **Imagens** | `ghcr.io/matrix-construct/tuwunel:v1.5.0` |
| **Porta da interface** | 6167, no serviço `tuwunel` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Tuwunel** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `registration_token` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `TUWUNEL_SERVER_NAME` | ${main_domain} |
| `TUWUNEL_REGISTRATION_TOKEN` | ${registration_token} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `tuwunel` | 6167 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  tuwunel:
    image: ghcr.io/matrix-construct/tuwunel:v1.5.0
    restart: always
    environment:
      - TUWUNEL_SERVER_NAME=${TUWUNEL_SERVER_NAME:-matrix.local}
      - TUWUNEL_ALLOW_REGISTRATION=${TUWUNEL_ALLOW_REGISTRATION:-false}
      - TUWUNEL_REGISTRATION_TOKEN=${TUWUNEL_REGISTRATION_TOKEN}
      - TUWUNEL_ADDRESS=${TUWUNEL_ADDRESS:-0.0.0.0}
      - TUWUNEL_PORT=${TUWUNEL_PORT:-6167}
    volumes:
      - tuwunel-data:/var/lib/tuwunel/
    expose:
      - 6167

volumes:
  tuwunel-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
