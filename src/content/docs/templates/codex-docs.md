---
title: Hospedar CodeX Docs com Rustploy
description: "Hub de engenharia com ferramentas unificadas como Editor.js e Hawk.so. Crie CodeX Docs em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**CodeX Docs**: Hub de engenharia com ferramentas unificadas como Editor.js e Hawk.so. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `codex-docs` |
| **Containers** | 2 (`codex`, `mongo`) |
| **Imagens** | `ghcr.io/codex-team/codex.docs:v2.2`, `mongo:4` |
| **Porta da interface** | 3000, no serviço `codex` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **CodeX Docs** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `MONGO_PASSWORD` | *senha aleatória de 16 caracteres* |
| `AUTH_PASSWORD` | *senha aleatória de 16 caracteres* |
| `AUTH_SECRET` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MONGO_PASSWORD` | ${MONGO_PASSWORD} |
| `AUTH_PASSWORD` | ${AUTH_PASSWORD} |
| `AUTH_SECRET` | ${AUTH_SECRET} |
| `MONGO_USERNAME` | mongo |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `codex` | 3000 | *domínio (gerado; troque pelo seu)* |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `/docs-config.yaml`

## docker-compose.yml do template

```yaml
version: "3"

services:
  codex:
    image: ghcr.io/codex-team/codex.docs:v2.2
    ports:
      - "3000"
    environment:
      - APP_CONFIG_database_driver=mongodb
      - APP_CONFIG_database_mongodb_uri=mongodb://mongo:${MONGO_PASSWORD}@mongo:27017
      - APP_CONFIG_auth_password=${AUTH_PASSWORD}
      - APP_CONFIG_auth_secret=${AUTH_SECRET}
    volumes:
      - uploads:/usr/src/app/uploads
      - db:/usr/src/app/db
      - ../files/docs-config.yaml:/usr/src/app/docs-config.yaml
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
  uploads:
  db:
  mongo-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
