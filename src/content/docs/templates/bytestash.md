---
title: Hospedar ByteStash com Rustploy
description: "Repositório privado e organizador de trechos de código (Snippets). Crie ByteStash em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**ByteStash**: Repositório privado e organizador de trechos de código (Snippets). O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bytestash` |
| **Containers** | 1 (`bytestash`) |
| **Imagens** | `ghcr.io/jordan-dalby/bytestash:1.5.6` |
| **Porta da interface** | 5000, no serviço `bytestash` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **ByteStash** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `jwt_secret` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `JWT_SECRET` | *JWT gerado* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `bytestash` | 5000 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  bytestash:
    image: ghcr.io/jordan-dalby/bytestash:1.5.6
    restart: unless-stopped
    ports:
      - "5000"
    environment:
      - BASE_PATH=
      - JWT_SECRET=${JWT_SECRET}
      - TOKEN_EXPIRY=24h
      - ALLOW_NEW_ACCOUNTS=true
      - DEBUG=true
      - DISABLE_ACCOUNTS=false
      - DISABLE_INTERNAL_ACCOUNTS=false
      - OIDC_ENABLED=false
      - OIDC_DISPLAY_NAME=
      - OIDC_ISSUER_URL=
      - OIDC_CLIENT_ID=
      - OIDC_CLIENT_SECRET=
      - OIDC_SCOPES=
    volumes:
      - snippets:/data/snippets

volumes:
  snippets:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
