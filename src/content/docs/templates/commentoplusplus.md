---
title: Hospedar Commentoplusplus com Rustploy
description: "Aplicação Commentoplusplus. Crie Commentoplusplus em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Commentoplusplus**: Aplicação Commentoplusplus. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `commentoplusplus` |
| **Containers** | 2 (`commentoplusplus`, `postgres`) |
| **Imagens** | `caroga/commentoplusplus:v1.8.7`, `postgres:11` |
| **Porta da interface** | 8080, no serviço `commentoplusplus` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Commentoplusplus** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `DOMAIN` | *domínio (gerado; troque pelo seu)* |
| `POSTGRES_PASSWORD` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `COMMENTO_ORIGIN` | http://${DOMAIN} |
| `COMMENTO_POSTGRES` | postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/postgres?sslmode=disable |
| `COMMENTO_ENABLE_WILDCARDS` | true |
| `POSTGRES_PASSWORD` | ${POSTGRES_PASSWORD} |
| `POSTGRES_DB` | postgres |
| `POSTGRES_USER` | postgres |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `commentoplusplus` | 8080 | ${DOMAIN} |

## docker-compose.yml do template

```yaml
version: "3"

services:
  commentoplusplus:
    image: caroga/commentoplusplus:v1.8.7
    ports:
      - "8080"
    environment:
      - COMMENTO_ORIGIN=${COMMENTO_ORIGIN}
      - COMMENTO_POSTGRES=${COMMENTO_POSTGRES}
      - COMMENTO_ENABLE_WILDCARDS=true
    depends_on:
      - postgres

  postgres:
    image: postgres:11
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
