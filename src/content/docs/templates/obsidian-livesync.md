---
title: Hospedar Obsidian LiveSync com Rustploy
description: "Servidor CouchDB pré-configurado para sincronização em tempo real das notas do Obsidian. Crie Obsidian LiveSync em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Obsidian LiveSync**: Servidor CouchDB pré-configurado para sincronização em tempo real das notas do Obsidian. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `obsidian-livesync` |
| **Containers** | 1 (`couchdb`) |
| **Imagens** | `couchdb:latest` |
| **Porta da interface** | 5984, no serviço `couchdb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Obsidian LiveSync** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `COUCHDB_USER` | *usuário gerado* |
| `COUCHDB_PASSWORD` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `COUCHDB_USER` | ${COUCHDB_USER} |
| `COUCHDB_PASSWORD` | ${COUCHDB_PASSWORD} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `couchdb` | 5984 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `local.ini`

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  couchdb:
    image: couchdb:latest
    user: "0:0"
    environment:
      - COUCHDB_USER=${COUCHDB_USER}
      - COUCHDB_PASSWORD=${COUCHDB_PASSWORD}
    volumes:
      - couchdb-data:/opt/couchdb/data
      - ../files/local.ini:/opt/couchdb/etc/local.ini
    ports:
      - 5984

volumes:
  couchdb-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
