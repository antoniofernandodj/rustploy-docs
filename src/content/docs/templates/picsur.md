---
title: Hospedar Picsur com Rustploy
description: "Servidor simplificado de hospedagem de imagens estruturado em PostgreSQL. Crie Picsur em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Picsur**: Servidor simplificado de hospedagem de imagens estruturado em PostgreSQL. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `picsur` |
| **Containers** | 2 (`picsur`, `picsur_postgres`) |
| **Imagens** | `ghcr.io/caramelfur/picsur:latest`, `postgres:17-alpine` |
| **Porta da interface** | 8080, no serviço `picsur` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Picsur** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `admin_password` | *senha aleatória de 32 caracteres* |
| `jwt_secret` | *JWT gerado* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `PICSUR_DB_PASSWORD` | ${postgres_password} |
| `PICSUR_ADMIN_PASSWORD` | ${admin_password} |
| `PICSUR_JWT_SECRET` | *JWT gerado* |
| `POSTGRES_PASSWORD` | ${postgres_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `picsur` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  picsur:
    image: ghcr.io/caramelfur/picsur:latest
    restart: unless-stopped
    environment:
      PICSUR_DB_HOST: picsur_postgres
      PICSUR_DB_PORT: 5432
      PICSUR_DB_USERNAME: picsur
      PICSUR_DB_PASSWORD: ${POSTGRES_PASSWORD}
      PICSUR_DB_DATABASE: picsur
      PICSUR_ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      PICSUR_JWT_SECRET: ${JWT_SECRET}
    expose:
      - 8080

  picsur_postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: picsur
      POSTGRES_USER: picsur
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - picsur-data:/var/lib/postgresql/data

volumes:
  picsur-data: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
