---
title: Hospedar Cockpit com Rustploy
description: "CMS Headless com arquitetura orientada a API para entrega de conteúdo. Crie Cockpit em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cockpit**: CMS Headless com arquitetura orientada a API para entrega de conteúdo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cockpit` |
| **Containers** | 2 (`cockpit`, `mongo`) |
| **Imagens** | `cockpithq/cockpit:core-2.11.0`, `mongo:4` |
| **Porta da interface** | 80, no serviço `cockpit` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cockpit** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `SALT` | *senha aleatória de 32 caracteres* |
| `MONGO_PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SALT` | ${SALT} |
| `MONGO_PASSWORD` | ${MONGO_PASSWORD} |
| `MONGO_USERNAME` | mongo |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `cockpit` | 80 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  cockpit:
    image: cockpithq/cockpit:core-2.11.0
    ports:
      - "80"
    environment:
      - COCKPIT_SESSION_NAME=cockpit
      - COCKPIT_SALT=${SALT}
      - COCKPIT_DATABASE_SERVER=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@mongo:27017
      - COCKPIT_DATABASE_NAME=cockpit
    volumes:
      - html:/var/www/html
      - data:/var/www/html/storage/data
    depends_on:
      - mongo

  mongo:
    image: mongo:4
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
    volumes:
      - mongo-data:/data/db

volumes:
  html:
  data:
  mongo-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
