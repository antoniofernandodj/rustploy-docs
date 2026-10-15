---
title: Hospedar Wiki.js com Rustploy
description: "Uma das ferramentas mais completas e extensíveis para criação de Wikis e documentações modernas. Crie Wiki.js em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Wiki.js**: Uma das ferramentas mais completas e extensíveis para criação de Wikis e documentações modernas. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `wikijs` |
| **Containers** | 2 (`wiki`, `db`) |
| **Imagens** | `ghcr.io/requarks/wiki:2.5`, `postgres:14` |
| **Porta da interface** | 3000, no serviço `wiki` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Wiki.js** e selecione.
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
| `POSTGRES_USER` | wikijs |
| `POSTGRES_PASSWORD` | wikijsrocks |
| `POSTGRES_DB` | wiki |
| `DB_TYPE` | postgres |
| `DB_HOST` | db |
| `DB_PORT` | 5432 |
| `DB_USER` | wikijs |
| `DB_PASS` | wikijsrocks |
| `DB_NAME` | wiki |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `wiki` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.5'
services:
  wiki:
    image: ghcr.io/requarks/wiki:2.5
    restart: unless-stopped
    environment:
      - DB_TYPE
      - DB_HOST
      - DB_PORT
      - DB_USER
      - DB_PASS
      - DB_NAME
    depends_on:
      - db
    labels:
      - traefik.enable=true
      - traefik.constraint-label-stack=wikijs
  db:
    image: postgres:14
    restart: unless-stopped
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - wiki-db-data:/var/lib/postgresql/data
volumes:
  wiki-db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
