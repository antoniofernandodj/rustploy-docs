---
title: Hospedar Grist com Rustploy
description: "Planilha inteligente open-source integrada com a estrutura relacional de banco de dados. Crie Grist em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Grist**: Planilha inteligente open-source integrada com a estrutura relacional de banco de dados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `grist` |
| **Containers** | 1 (`grist`) |
| **Imagens** | `gristlabs/grist:latest` |
| **Porta da interface** | 8484, no serviço `grist` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Grist** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `default_email` | *e-mail gerado* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `GRIST_DEFAULT_EMAIL` | ${default_email} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `grist` | 8484 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  grist:
    image: gristlabs/grist:latest
    restart: unless-stopped
    ports:
      - 8484
    volumes:
      - grist_data:/persist
    environment:
      GRIST_DEFAULT_EMAIL: ${GRIST_DEFAULT_EMAIL:-}
      GRIST_SESSION_SECRET: ${GRIST_SESSION_SECRET:-}
      GRIST_SINGLE_ORG: ${GRIST_SINGLE_ORG:-}
      GRIST_HOME_INSTANCE: ${GRIST_HOME_INSTANCE:-}

volumes:
  grist_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
