---
title: Hospedar Argilla com Rustploy
description: "Plataforma para curadoria de dados e fluxos de Machine Learning. Crie Argilla em um clique no Rustploy: 5 containers, variáveis geradas, domínio e HTTPS automático."
sidebar:
  hidden: true
---

**Argilla**: Plataforma para curadoria de dados e fluxos de Machine Learning. O Rustploy tem um template pronto: você escolhe, ajusta o domínio e faz o deploy.

## Resumo

| | |
|---|---|
| **Identificador** | `argilla` |
| **Containers** | 5 (`argilla-web`, `argilla-worker`, `argilla-elasticsearch`, `argilla-db`, `argilla-redis`) |
| **Imagens** | `argilla/argilla-server:latest`, `docker.elastic.co/elasticsearch/elasticsearch:8.12.2`, `postgres:15-alpine`, `redis:7-alpine` |
| **Porta da interface** | 6900, no serviço `argilla-web` |
| **Tipo no Rustploy** | Stack Compose |

## Como criar

1. No projeto, clique em **+ Novo serviço → Template**.
2. Busque por **Argilla** e selecione.
3. Dê um nome ao serviço e revise as variáveis. As senhas e chaves já vêm geradas.
4. Crie e faça o **Deploy**.
5. Aponte o seu domínio em **Domains**. Veja [Domínios e HTTPS](/guias/dominios-e-tls/).

## Variáveis de ambiente

**Variáveis do template** (valores calculados na criação):

| Variável | Valor |
|---|---|
| `main_domain` | *domínio (gerado; troque pelo seu)* |
| `login_username` | *usuário gerado* |
| `login_password` | *senha aleatória de 8 caracteres* |
| `db_password` | *senha aleatória de 16 caracteres* |
| `redis_password` | *senha aleatória de 16 caracteres* |

**Entregues ao container:**

| Variável | Valor |
|---|---|
| `LOGIN_USERNAME` | ${login_username} |
| `LOGIN_PASSWORD` | ${login_password} |
| `DB_PASSWORD` | ${db_password} |
| `REDIS_PASSWORD` | ${redis_password} |
| `BACKGROUND_NUM_WORKERS` | 2 |

## Domínios

| Serviço | Porta | Host |
|---|---|---|
| `argilla-web` | 6900 | ${main_domain} |

## docker-compose.yml do template

```yaml
version: "3.8"
services:
  argilla-web:
    image: argilla/argilla-server:latest
    restart: unless-stopped
    ports:
      - 6900
    environment:
      - ARGILLA_HOME_PATH=/var/lib/argilla
      - ARGILLA_ELASTICSEARCH=http://argilla-elasticsearch:9200
      - ARGILLA_DATABASE_URL=postgresql+asyncpg://postgres:${DB_PASSWORD}@argilla-db:5432/argilla
      - ARGILLA_REDIS_URL=redis://:${REDIS_PASSWORD}@argilla-redis:6379/0
      - USERNAME=${LOGIN_USERNAME}
      - PASSWORD=${LOGIN_PASSWORD}
      - API_KEY=argilla.apikey
      - WORKSPACE=default
    volumes:
      - argilladata:/var/lib/argilla
    depends_on:
      - argilla-elasticsearch
      - argilla-db
      - argilla-redis

  argilla-worker:
    image: argilla/argilla-server:latest
    restart: unless-stopped
    environment:
      - BACKGROUND_NUM_WORKERS=2
      - ARGILLA_HOME_PATH=/var/lib/argilla
      - ARGILLA_ELASTICSEARCH=http://argilla-elasticsearch:9200
      - ARGILLA_DATABASE_URL=postgresql+asyncpg://postgres:${DB_PASSWORD}@argilla-db:5432/argilla
      - ARGILLA_REDIS_URL=redis://:${REDIS_PASSWORD}@argilla-redis:6379/0
    volumes:
      - argilladata:/var/lib/argilla
    command: python -m argilla_server worker --num-workers ${BACKGROUND_NUM_WORKERS}
    depends_on:
      - argilla-elasticsearch
      - argilla-db
      - argilla-redis

  argilla-elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.12.2
    restart: unless-stopped
    environment:
      - node.name=elasticsearch
      - cluster.name=es-argilla-local
      - discovery.type=single-node
      - ES_JAVA_OPTS=-Xms512m -Xmx512m
      - cluster.routing.allocation.disk.threshold_enabled=false
      - xpack.security.enabled=false
    volumes:
      - elasticdata:/usr/share/elasticsearch/data

  argilla-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=argilla
    volumes:
      - dbdata:/var/lib/postgresql/data

  argilla-redis:
    image: redis:7-alpine
    restart: unless-stopped
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redisdata:/data

volumes:
  argilladata: {}
  elasticdata: {}
  dbdata: {}
  redisdata: {}
```

## Veja também

- [Templates de um clique](/guias/templates/)
- [Stacks Docker Compose](/guias/compose/)
- [Diagnosticar um 502](/guias/diagnosticar-502/)
