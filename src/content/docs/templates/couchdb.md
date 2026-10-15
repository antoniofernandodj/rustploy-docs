---
title: Hospedar CouchDB com Rustploy
description: "Banco de dados NoSQL baseado em documentos com excelente sincronização. Crie CouchDB em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**CouchDB**: Banco de dados NoSQL baseado em documentos com excelente sincronização. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `couchdb` |
| **Containers** | 1 (`couchdb`) |
| **Imagens** | `couchdb:latest` |
| **Porta da interface** | 5984, no serviço `couchdb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **CouchDB** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `username` | *senha aleatória de 16 caracteres* |
| `password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `COUCHDB_USER` | *usuário gerado* |
| `COUCHDB_PASSWORD` | *senha aleatória* |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `couchdb` | 5984 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  couchdb:
    image: couchdb:latest
    ports:
      - '5984'
    volumes:
      - couchdb-data:/opt/couchdb/data
    environment:
      - COUCHDB_USER=${COUCHDB_USER}
      - COUCHDB_PASSWORD=${COUCHDB_PASSWORD}
    restart: unless-stopped

volumes:
  couchdb-data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
