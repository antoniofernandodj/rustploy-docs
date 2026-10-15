---
title: Hospedar Aptabase com Rustploy
description: "Plataforma auto-hospedada para análise de tráfego web. Crie Aptabase em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Aptabase**: Plataforma auto-hospedada para análise de tráfego web. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `aptabase` |
| **Containers** | 3 (`aptabase_db`, `aptabase_events_db`, `aptabase`) |
| **Imagens** | `postgres:15-alpine`, `clickhouse/clickhouse-server:23.8.16.16-alpine`, `ghcr.io/aptabase/aptabase:main` |
| **Porta da interface** | 8080, no serviço `aptabase` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Aptabase** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `auth_secret` | *chave base64 aleatória (32 bytes)* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `APTABASE_HOST` | ${main_domain} |
| `AUTH_SECRET` | ${auth_secret} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `aptabase` | 8080 | ${main_domain} |

## docker-compose.yml do template

```yaml
services:
  aptabase_db:
    image: postgres:15-alpine
    restart: always
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: aptabase
      POSTGRES_PASSWORD: sTr0NGp4ssw0rd

    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U aptabase"]
      interval: 10s
      timeout: 5s
      retries: 5

  aptabase_events_db:
    image: clickhouse/clickhouse-server:23.8.16.16-alpine
    restart: always
    volumes:
      - events-db-data:/var/lib/clickhouse
    environment:
      CLICKHOUSE_USER: aptabase
      CLICKHOUSE_PASSWORD: sTr0NGp4ssw0rd
    ulimits:
      nofile:
        soft: 262144
        hard: 262144

    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8123 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  aptabase:
    image: ghcr.io/aptabase/aptabase:main
    restart: always
    environment:
      BASE_URL: http://${APTABASE_HOST}
      AUTH_SECRET: ${AUTH_SECRET}
      DATABASE_URL: Server=aptabase_db;Port=5432;User Id=aptabase;Password=sTr0NGp4ssw0rd;Database=aptabase
      CLICKHOUSE_URL: Host=aptabase_events_db;Port=8123;Username=aptabase;Password=sTr0NGp4ssw0rd

volumes:
  db-data:
    driver: local
  events-db-data:
    driver: local
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
