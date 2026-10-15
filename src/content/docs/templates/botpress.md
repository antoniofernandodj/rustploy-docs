---
title: Hospedar Botpress com Rustploy
description: "Plataforma para criação e orquestração de agentes de IA conversacionais. Crie Botpress em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Botpress**: Plataforma para criação e orquestração de agentes de IA conversacionais. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `botpress` |
| **Containers** | 2 (`botpress`, `botpress-db`) |
| **Imagens** | `botpress/server:12.31.9`, `postgres:15-alpine` |
| **Porta da interface** | 81, no serviço `botpress` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Botpress** e selecione.
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
| `botpress` | 81 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  botpress:
    image: botpress/server:12.31.9
    restart: unless-stopped
    ports:
      - 81
    environment:
      - BP_HOST=0.0.0.0
      - NODE_ENV=production
      - PG_HOST=botpress-db
      - PG_PORT=5432
      - PG_USER=postgres
      - PG_PASSWORD=${DB_PASSWORD}
      - PG_SSL=false
      - PORT=80
    volumes:
      - data:/botpress/data
    depends_on:
      - botpress-db

  botpress-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=botpress
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
