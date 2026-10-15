---
title: Hospedar SurrealDB com Rustploy
description: "Banco de dados multimodel moderno (relacional, grafos, documentos, vetorial) unificado. Crie SurrealDB em um clique no Rustploy: 1 container, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**SurrealDB**: Banco de dados multimodel moderno (relacional, grafos, documentos, vetorial) unificado. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `surrealdb` |
| **Containers** | 1 (`surrealdb`) |
| **Imagens** | `surrealdb/surrealdb:v2.3.10` |
| **Porta da interface** | 8000, no serviço `surrealdb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **SurrealDB** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `surrealdb_user` | *usuário gerado* |
| `surrealdb_password` | *senha aleatória de 32 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SURREAL_USER` | ${surrealdb_user} |
| `SURREAL_PASS` | ${surrealdb_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `surrealdb` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  surrealdb:
    image: surrealdb/surrealdb:v2.3.10
    environment:
      SURREAL_USER: ${SURREAL_USER}
      SURREAL_PASS: ${SURREAL_PASS}
    volumes:
      - db_data:/usr/app/data
    user: root
    command: start rocksdb:/db_data/data.db
    pull_policy: always

volumes:
  db_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
