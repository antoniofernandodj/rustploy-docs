---
title: Hospedar NocoDB com Rustploy
description: "Transforma qualquer banco de dados relacional (Postgres/MySQL) em uma interface inteligente estilo Airtable. Crie NocoDB em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**NocoDB**: Transforma qualquer banco de dados relacional (Postgres/MySQL) em uma interface inteligente estilo Airtable. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `nocodb` |
| **Containers** | 2 (`nocodb`, `root_db`) |
| **Imagens** | `nocodb/nocodb:latest`, `postgres:16.6` |
| **Porta da interface** | 8080, no serviço `nocodb` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **NocoDB** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_user` | postgres |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `postgres_db` | root_db |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `nocodb` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  nocodb:
    image: nocodb/nocodb:latest
    restart: always
    depends_on:
      root_db:
        condition: service_healthy
    environment:
      # Reuses DB env from template.toml / .env
      NC_DB: "pg://root_db:5432?u=${POSTGRES_USER}&p=${POSTGRES_PASSWORD}&d=${POSTGRES_DB}"
    volumes:
      - nc_data:/usr/app/data

  root_db:
    image: postgres:16.6
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    # More reliable healthcheck:
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'pg_isready -h 127.0.0.1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"',
        ]
      interval: 10s
      timeout: 5s
      start_period: 20s
      retries: 10
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data: {}
  nc_data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
