---
title: Hospedar Ackee com Rustploy
description: "Analytics focado em privacidade para websites. Crie Ackee em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Ackee**: Analytics focado em privacidade para websites. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `ackee` |
| **Containers** | 2 (`ackee`, `mongo`) |
| **Imagens** | `electerious/ackee:3.4.2`, `mongo:4` |
| **Porta da interface** | 3000, no serviço `ackee` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Ackee** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `ACKEE_USERNAME` | default |
| `ACKEE_PASSWORD` | *senha aleatória de 16 caracteres* |
| `MONGO_INITDB_ROOT_PASSWORD` | *senha aleatória de 16 caracteres* |
| `ACKEE_MONGODB` | mongodb://mongo:${MONGO_INITDB_ROOT_PASSWORD}@mongo:27017 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `ACKEE_USERNAME` | ${ACKEE_USERNAME} |
| `ACKEE_PASSWORD` | ${ACKEE_PASSWORD} |
| `ACKEE_MONGODB` | ${ACKEE_MONGODB} |
| `MONGO_INITDB_ROOT_PASSWORD` | ${MONGO_INITDB_ROOT_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `ackee` | 3000 | *domínio (gerado; troque pelo seu)* |

## docker-compose.yml do template

```yaml
version: "3"

services:
  ackee:
    image: electerious/ackee:3.4.2
    ports:
      - "3000"
    environment:
      - ACKEE_USERNAME=${ACKEE_USERNAME}
      - ACKEE_PASSWORD=${ACKEE_PASSWORD}
      - ACKEE_MONGODB=${ACKEE_MONGODB}
  
  mongo:
    image: mongo:4
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
      - MONGO_INITDB_ROOT_USERNAME=mongo
    volumes:
      - mongo-data:/data/db


volumes:
  mongo-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
