---
title: Hospedar Cloudreve com Rustploy
description: "Sistema de gerenciamento e compartilhamento de arquivos multi-nuvem. Crie Cloudreve em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Cloudreve**: Sistema de gerenciamento e compartilhamento de arquivos multi-nuvem. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `cloudreve` |
| **Containers** | 3 (`cloudreve`, `postgresql`, `redis`) |
| **Imagens** | `cloudreve/cloudreve:4.10.1`, `postgres:17`, `redis:8.4.0` |
| **Porta da interface** | 5212, no serviço `cloudreve` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Cloudreve** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `db_password` | *senha aleatória de 32 caracteres* |
| `db_user` | cloudreve |
| `db_name` | cloudreve |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `POSTGRES_PASSWORD` | ${db_password} |
| `POSTGRES_USER` | ${db_user} |
| `POSTGRES_DB` | ${db_name} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `cloudreve` | 5212 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"

services:
  cloudreve:
    image: cloudreve/cloudreve:4.10.1
    depends_on:
      postgresql:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped
    environment:
      - CR_CONF_Database.Type=postgres
      - CR_CONF_Database.Host=postgresql
      - CR_CONF_Database.User=${POSTGRES_USER}
      - CR_CONF_Database.Password=${POSTGRES_PASSWORD}
      - CR_CONF_Database.Name=${POSTGRES_DB}
      - CR_CONF_Database.Port=5432
      - CR_CONF_Redis.Server=redis:6379
    volumes:
      - cloudreve_data:/cloudreve/data

  postgresql:
    image: postgres:17
    restart: unless-stopped
    environment:
      - POSTGRES_USER
      - POSTGRES_PASSWORD
      - POSTGRES_DB
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    image: redis:8.4.0
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  cloudreve_data:
  postgres_data:
  redis_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
