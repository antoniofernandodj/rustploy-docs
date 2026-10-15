---
title: Hospedar Evershop com Rustploy
description: "Solução completa e modular de e-commerce e loja virtual. Crie Evershop em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Evershop**: Solução completa e modular de e-commerce e loja virtual. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `evershop` |
| **Containers** | 2 (`evershop-app`, `database`) |
| **Imagens** | `evershop/evershop:latest`, `postgres:16` |
| **Porta da interface** | 3000, no serviço `evershop-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Evershop** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_user` | postgres |
| `db_password` | postgres |
| `db_name` | evershop |
| `db_port` | 5432 |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `DB_USER` | ${db_user} |
| `DB_PASSWORD` | ${db_password} |
| `DB_NAME` | ${db_name} |
| `DB_PORT` | ${db_port} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `evershop-app` | 3000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: '3.8'

services:
  evershop-app:
    image: evershop/evershop:latest
    restart: always
    environment:
      DB_HOST: database
      DB_PORT: ${DB_PORT}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_USER: ${DB_USER}
      DB_NAME: ${DB_NAME}
    depends_on:
      - database
    ports:
      - 3000
  
  database:
    image: postgres:16
    restart: unless-stopped
    volumes:
      - postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - ${DB_PORT}

volumes:
  postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
