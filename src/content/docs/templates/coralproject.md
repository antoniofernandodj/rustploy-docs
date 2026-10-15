---
title: Hospedar Coralproject com Rustploy
description: "Aplicação Coralproject. Crie Coralproject em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Coralproject**: Aplicação Coralproject. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `coralproject` |
| **Containers** | 3 (`coral`, `mongo`, `redis`) |
| **Imagens** | `coralproject/talk:9.7.0`, `mongo:4`, `redis:6` |
| **Porta da interface** | 3000, no serviço `coral` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Coralproject** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `DOMAIN` | *domínio (gerado; troque pelo seu)* |
| `MONGO_PASSWORD` | *senha aleatória de 16 caracteres* |
| `REDIS_PASSWORD` | *senha aleatória de 16 caracteres* |
| `SIGNING_SECRET` | *senha aleatória de 45 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MONGODB_URI` | mongodb://mongo:${MONGO_PASSWORD}@mongo:27017 |
| `REDIS_URI` | redis://default:${REDIS_PASSWORD}@redis:6379 |
| `SIGNING_SECRET` | ${SIGNING_SECRET} |
| `NODE_ENV` | production |
| `MONGO_PASSWORD` | ${MONGO_PASSWORD} |
| `REDIS_PASSWORD` | ${REDIS_PASSWORD} |
| `MONGO_USER` | mongo |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `coral` | 3000 | ${DOMAIN} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  coral:
    image: coralproject/talk:9.7.0
    ports:
      - "3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_URI=${REDIS_URI}
      - SIGNING_SECRET=${SIGNING_SECRET}
      - NODE_ENV=production
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:4
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:6
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
