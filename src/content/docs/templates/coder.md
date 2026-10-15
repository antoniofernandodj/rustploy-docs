---
title: Hospedar Coder com Rustploy
description: "Ambiente de desenvolvimento baseado em nuvem (CDE) corporativo. Crie Coder em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Coder**: Ambiente de desenvolvimento baseado em nuvem (CDE) corporativo. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `coder` |
| **Containers** | 2 (`coder`, `db`) |
| **Imagens** | `ghcr.io/coder/coder:v2.15.3`, `postgres:17` |
| **Porta da interface** | 7080, no serviço `coder` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Coder** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `CODER_ACCESS_URL` |  |
| `CODER_HTTP_ADDRESS` | 0.0.0.0:7080 |
| `POSTGRES_DB` | coder |
| `POSTGRES_USER` | coder |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `coder` | 7080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  coder:
    image: ghcr.io/coder/coder:v2.15.3

    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    group_add:
      - "988"
    depends_on:
      db:
        condition: service_healthy
    environment:
      - CODER_ACCESS_URL
      - CODER_HTTP_ADDRESS
      - CODER_PG_CONNECTION_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db/${POSTGRES_DB}?sslmode=disable

  db:
    image: postgres:17

    environment:
      - POSTGRES_PASSWORD
      - POSTGRES_USER
      - POSTGRES_DB
    healthcheck:
      test:
        [
          "CMD-SHELL",
          "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}",
        ]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - db_coder_data:/var/lib/postgresql/data

volumes:
  db_coder_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
