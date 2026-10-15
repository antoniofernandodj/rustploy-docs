---
title: Hospedar Bugsink com Rustploy
description: "Rastreador de erros de software auto-hospedado compatível com Sentry-SDK. Crie Bugsink em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Bugsink**: Rastreador de erros de software auto-hospedado compatível com Sentry-SDK. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `bugsink` |
| **Containers** | 2 (`db`, `web`) |
| **Imagens** | `postgres:17-alpine`, `bugsink/bugsink:latest` |
| **Porta da interface** | 8000, no serviço `web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Bugsink** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `postgres_user` | bugsinkuser |
| `postgres_password` | *senha aleatória de 32 caracteres* |
| `postgres_db` | bugsink |
| `secret_key` | *senha aleatória de 64 caracteres* |
| `superuser` | admin:admin |
| `behind_https_proxy` | false |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_USER` | ${postgres_user} |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `POSTGRES_DB` | ${postgres_db} |
| `SECRET_KEY` | ${secret_key} |
| `CREATE_SUPERUSER` | ${superuser} |
| `BEHIND_HTTPS_PROXY` | ${behind_https_proxy} |
| `BASE_URL` | https://${main_domain} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `web` | 8000 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -h db"]
      retries: 5
      start_period: 10s
      interval: 5s
      timeout: 5s

  web:
    image: bugsink/bugsink:latest
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    expose:
      - 8000
    environment:
      SECRET_KEY: ${SECRET_KEY}
      CREATE_SUPERUSER: ${CREATE_SUPERUSER}
      PORT: 8000
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      BEHIND_HTTPS_PROXY: ${BEHIND_HTTPS_PROXY}
      BASE_URL: ${BASE_URL}
    healthcheck:
      test:
        [
          "CMD-SHELL",
          'python -c ''import requests; requests.get("http://localhost:8000/").raise_for_status()''',
        ]
      interval: 5s
      timeout: 20s
      retries: 10

volumes:
  db-data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
