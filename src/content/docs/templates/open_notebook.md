---
title: Hospedar Open Notebook com Rustploy
description: "Caderno de notas integrado com SurrealDB e utilitários assistidos por IA. Crie Open Notebook em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Open Notebook**: Caderno de notas integrado com SurrealDB e utilitários assistidos por IA. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `open_notebook` |
| **Containers** | 2 (`surrealdb`, `open_notebook`) |
| **Imagens** | `surrealdb/surrealdb:v2`, `lfnovo/open_notebook:latest` |
| **Porta da interface** | 8000, no serviço `surrealdb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Open Notebook** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `surrealdb_port` | 8000 |
| `open_notebook_port` | 8502 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SURREAL_URL` | ws://surrealdb:8000/rpc |
| `SURREAL_USER` | root |
| `SURREAL_PASSWORD` | root |
| `SURREAL_NAMESPACE` | open_notebook |
| `SURREAL_DATABASE` | staging |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `surrealdb` | 8000 | surrealdb-${main_domain} |
| `open_notebook` | 8502 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  surrealdb:
    image: surrealdb/surrealdb:v2
    ports:
      - 8000
    volumes:
      - ../files/surreal_data:/mydata
    command: start --user root --pass root rocksdb:/mydata/mydatabase.db
    pull_policy: always
    user: root

  open_notebook:
    image: lfnovo/open_notebook:latest
    ports:
      - 8502
    environment:
      - SURREAL_URL=ws://surrealdb:8000/rpc
      - SURREAL_USER=root
      - SURREAL_PASSWORD=root
      - SURREAL_NAMESPACE=open_notebook
      - SURREAL_DATABASE=staging
    depends_on:
      - surrealdb
    pull_policy: always
    volumes:
      - ../files/notebook_data:/app/data
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
