---
title: Hospedar Bytebase com Rustploy
description: "Ferramenta para controle e gerenciamento do ciclo de vida de bancos de dados. Crie Bytebase em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Bytebase**: Ferramenta para controle e gerenciamento do ciclo de vida de bancos de dados. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bytebase` |
| **Containers** | 2 (`bytebase`, `bytebase-db`) |
| **Imagens** | `bytebase/bytebase:3.3.0`, `postgres:13` |
| **Porta da interface** | 8080, no serviço `bytebase` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Bytebase** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_PASSWORD` | ${db_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `bytebase` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  bytebase:
    image: bytebase/bytebase:3.3.0
    restart: unless-stopped
    ports:
      - 8080
    environment:
      - PG_URL=postgres://postgres:${DB_PASSWORD}@bytebase-db:5432/bytebase
    volumes:
      - data:/var/opt/bytebase
    depends_on:
      - bytebase-db

  bytebase-db:
    image: postgres:13
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=bytebase
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  data: {}
  db_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
