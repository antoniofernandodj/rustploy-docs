---
title: Hospedar Rocketchat com Rustploy
description: "Ecossistema completo de chat e comunicação interna corporativa. Crie Rocketchat em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Rocketchat**: Ecossistema completo de chat e comunicação interna corporativa. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `rocketchat` |
| **Containers** | 2 (`rocketchat`, `mongodb`) |
| **Imagens** | `registry.rocket.chat/rocketchat/rocket.chat:6.9.2`, `docker.io/bitnami/mongodb:5.0` |
| **Porta da interface** | 3000, no serviço `rocketchat` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Rocketchat** e selecione.
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
| `ROCKETCHAT_HOST` | ${main_domain} |
| `ROCKETCHAT_PORT` | 3000 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `rocketchat` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  rocketchat:
    image: registry.rocket.chat/rocketchat/rocket.chat:6.9.2
    restart: always
    environment:
      MONGO_URL: "mongodb://mongodb:27017/rocketchat?replicaSet=rs0"
      MONGO_OPLOG_URL: "mongodb://mongodb:27017/local?replicaSet=rs0"
      ROOT_URL: ${ROOT_URL:-http://${ROCKETCHAT_HOST}:${ROCKETCHAT_PORT}}
      PORT: ${ROCKETCHAT_PORT}
      DEPLOY_METHOD: docker
      DEPLOY_PLATFORM:
      REG_TOKEN:
    depends_on:
      - mongodb

  mongodb:
    image: docker.io/bitnami/mongodb:5.0
    restart: always
    volumes:
      - mongodb_data:/bitnami/mongodb
    environment:
      MONGODB_REPLICA_SET_MODE: primary
      MONGODB_REPLICA_SET_NAME: rs0
      MONGODB_PORT_NUMBER: 27017
      MONGODB_INITIAL_PRIMARY_HOST: mongodb
      MONGODB_INITIAL_PRIMARY_PORT_NUMBER: 27017
      MONGODB_ADVERTISED_HOSTNAME: mongodb
      MONGODB_ENABLE_JOURNAL: true
      ALLOW_EMPTY_PASSWORD: yes


volumes:
  mongodb_data: { driver: local }
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
