---
title: Hospedar Peppermint com Rustploy
description: "Ambiente unificado focado em documentação, design e testes rápidos de endpoints de API. Crie Peppermint em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Peppermint**: Ambiente unificado focado em documentação, design e testes rápidos de endpoints de API. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `peppermint` |
| **Containers** | 2 (`peppermint-postgres`, `peppermint-app`) |
| **Imagens** | `postgres:latest`, `pepperlabs/peppermint:latest` |
| **Porta da interface** | 3000, no serviço `peppermint-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Peppermint** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `api_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_password` | *senha aleatória* |
| `secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `MAIN_DOMAIN` | ${main_domain} |
| `API_DOMAIN` | ${api_domain} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `SECRET` | ${secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `peppermint-app` | 3000 | ${main_domain} |
| `peppermint-app` | 5003 | ${api_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  peppermint-postgres:
    image: postgres:latest
    restart: always

    volumes:
      - peppermint-postgres-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: peppermint
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: peppermint
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U peppermint"]
      interval: 10s
      timeout: 5s
      retries: 5

  peppermint-app:
    image: pepperlabs/peppermint:latest
    restart: always

    depends_on:
      peppermint-postgres:
        condition: service_healthy
    environment:
      DB_USERNAME: "peppermint"
      DB_PASSWORD: ${POSTGRES_PASSWORD}
      DB_HOST: "peppermint-postgres"
      SECRET: ${SECRET}

volumes:
  peppermint-postgres-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
