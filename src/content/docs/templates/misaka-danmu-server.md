---
title: Hospedar Misaka Danmu Server com Rustploy
description: "Servidor dedicado ao gerenciamento de comentários flutuantes (danmaku) para streams. Crie Misaka Danmu Server em um clique no Rustploy: 2 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Misaka Danmu Server**: Servidor dedicado ao gerenciamento de comentários flutuantes (danmaku) para streams. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `misaka-danmu-server` |
| **Containers** | 2 (`postgres`, `danmu-app`) |
| **Imagens** | `postgres:18`, `l429609201/misaka_danmu_server:latest` |
| **Porta da interface** | 7768, no serviço `danmu-app` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Misaka Danmu Server** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 24 caracteres* |
| `db_user` | danmuapi |
| `db_name` | danmuapi |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${db_password} |
| `POSTGRES_USER` | ${db_user} |
| `POSTGRES_DB` | ${db_name} |
| `DANMUAPI_DATABASE__TYPE` | postgresql |
| `DANMUAPI_DATABASE__HOST` | postgres |
| `DANMUAPI_DATABASE__PORT` | 5432 |
| `DANMUAPI_DATABASE__NAME` | ${db_name} |
| `DANMUAPI_DATABASE__USER` | ${db_user} |
| `DANMUAPI_DATABASE__PASSWORD` | ${db_password} |
| `DANMUAPI_ADMIN__INITIAL_USER` | admin |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `danmu-app` | 7768 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:18
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD
      - POSTGRES_USER
      - POSTGRES_DB
      - TZ=Asia/Shanghai
    volumes:
      - postgres-data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U danmuapi -d danmuapi"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 60s

  danmu-app:
    image: l429609201/misaka_danmu_server:latest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - PUID=1000
      - PGID=1000
      - UMASK=0022
      - TZ=Asia/Shanghai
      - DANMUAPI_DATABASE__TYPE
      - DANMUAPI_DATABASE__HOST
      - DANMUAPI_DATABASE__PORT
      - DANMUAPI_DATABASE__NAME
      - DANMUAPI_DATABASE__USER
      - DANMUAPI_DATABASE__PASSWORD
      - DANMUAPI_ADMIN__INITIAL_USER
    volumes:
      - danmu-config:/app/config

volumes:
  postgres-data: {}
  danmu-config: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
