---
title: Hospedar Superset com Rustploy
description: "Aplicação Superset. Crie Superset em um clique no Rustploy: 3 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Superset**: Aplicação Superset. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `superset` |
| **Containers** | 3 (`superset`, `superset_postgres`, `superset_redis`) |
| **Imagens** | `amancevice/superset:6.0.0`, `postgres:18`, `redis:8` |
| **Porta da interface** | 8088, no serviço `superset` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Superset** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `secret_key` | *senha aleatória de 30 caracteres* |
| `postgres_password` | *senha aleatória de 30 caracteres* |
| `redis_password` | *senha aleatória de 30 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `SECRET_KEY` | ${secret_key} |
| `MAPBOX_API_KEY` |  |
| `POSTGRES_DB` | superset |
| `POSTGRES_USER` | superset |
| `POSTGRES_PASSWORD` | ${postgres_password} |
| `REDIS_PASSWORD` | ${redis_password} |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `superset` | 8088 | ${main_domain} |

## Arquivos de configuração

O template grava estes arquivos no servidor e os monta nos containers:

- `./superset/superset_config.py`

## docker-compose.yml do template

```yaml
# This is an UNOFFICIAL production docker image build for Superset:
# - https://github.com/amancevice/docker-superset
#
#
# ## SETUP INSTRUCTIONS
#
# After deploying this image, you will need to run one of the two
# commands below in a terminal within the superset container:
#      $ superset-demo     # Initialise database + load demo charts/datasets
#      $ superset-init     # Initialise database only
#
# You will be prompted to enter the credentials for the admin user.
#
#
# ## NETWORK INSTRUCTIONS
#
# If you want to connect superset with other internal databases managed by
# Dokploy using internal hostnames, you will need to connect the `superset`
# container to those networks.
#

services:
  superset:
    image: amancevice/superset:6.0.0
    restart: unless-stopped
    #networks:
    #  - dokploy-network
    depends_on:
      - superset_postgres
      - superset_redis
    volumes:
      # This superset_config.py can be edited in Dokploy's UI Advanced -> Volume Mount
      - ../files/superset/superset_config.py:/etc/superset/superset_config.py
    environment:
      SECRET_KEY: ${SECRET_KEY}
      MAPBOX_API_KEY: ${MAPBOX_API_KEY}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      # Ensure the hosts matches your service names below.
      POSTGRES_HOST: superset_postgres
      REDIS_HOST: superset_redis

  superset_postgres:
    image: postgres:18
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - superset_postgres_data:/var/lib/postgresql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 30s
      timeout: 10s
      retries: 3

  superset_redis:
    image: redis:8
    restart: unless-stopped
    volumes:
      - superset_redis_data:/data
    command: redis-server --requirepass ${REDIS_PASSWORD}
    healthcheck:
      test: ["CMD-SHELL", "redis-cli -a $${REDIS_PASSWORD} ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  superset_postgres_data:
  superset_redis_data:
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
